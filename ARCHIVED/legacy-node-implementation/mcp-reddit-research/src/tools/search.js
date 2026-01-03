/**
 * Search Reddit Threads Tool
 * Searches for medication-related threads in pregnancy subreddits
 */

import { getRedditClient } from '../auth.js';
import { anonymizeUsername } from '../privacy/anonymize.js';
import { globalRateLimiter, withExponentialBackoff } from '../utils/rate-limiter.js';
import { searchCache, TTL } from '../utils/cache.js';

/**
 * Convert YYYY-MM-DD date string to Unix timestamp
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {number} Unix timestamp
 */
function dateToUnixTimestamp(dateString) {
  return Math.floor(new Date(dateString).getTime() / 1000);
}

/**
 * Count words in text
 * @param {string} text - Text to count words in
 * @returns {number} Word count
 */
function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Build Reddit search query
 * @param {string} medicationName - Medication name
 * @param {string[]} subreddits - Target subreddits
 * @returns {string} Search query
 */
function buildSearchQuery(medicationName, subreddits) {
  // Search for medication name across specified subreddits
  const subredditQuery = subreddits.map(sub => `subreddit:${sub}`).join(' OR ');
  return `${medicationName} (${subredditQuery})`;
}

/**
 * Search for medication-related threads in pregnancy subreddits
 *
 * @param {Object} params - Search parameters
 * @param {string} params.medication_name - Name of medication to search for
 * @param {string[]} params.subreddits - Target subreddits (without r/ prefix)
 * @param {string} [params.start_date='2019-01-01'] - Start date YYYY-MM-DD
 * @param {string} [params.end_date='2023-12-31'] - End date YYYY-MM-DD
 * @param {number} [params.min_comments=5] - Minimum comment count
 * @param {number} [params.min_words=50] - Minimum word count in post
 * @param {number} [params.max_results=100] - Maximum threads to return
 * @returns {Promise<Object>} Search results
 */
export async function searchRedditThreads(params) {
  // Validate required parameters
  if (!params.medication_name) {
    throw new Error('medication_name is required');
  }

  if (!params.subreddits || !Array.isArray(params.subreddits) || params.subreddits.length === 0) {
    throw new Error('subreddits must be a non-empty array');
  }

  // Set defaults
  const medicationName = params.medication_name.toLowerCase();
  const subreddits = params.subreddits.map(sub => sub.toLowerCase().replace(/^r\//, ''));
  const startDate = params.start_date || '2019-01-01';
  const endDate = params.end_date || '2023-12-31';
  const minComments = params.min_comments ?? 5;
  const minWords = params.min_words ?? 50;
  const maxResults = params.max_results ?? 100;

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    throw new Error(
      'Date format should be YYYY-MM-DD (e.g., 2021-01-15). ' +
      `Received: start_date="${startDate}", end_date="${endDate}"`
    );
  }

  // Convert dates to timestamps
  const startTimestamp = dateToUnixTimestamp(startDate);
  const endTimestamp = dateToUnixTimestamp(endDate);

  // Check cache
  const cacheKey = JSON.stringify({
    medicationName,
    subreddits,
    startDate,
    endDate,
    minComments,
    minWords,
    maxResults
  });

  const cached = searchCache.get(cacheKey);
  if (cached) {
    console.error('[Search Cache] Hit - returning cached results');
    return cached;
  }

  try {
    // Get Reddit client
    const reddit = await getRedditClient();

    // Build search query
    const query = buildSearchQuery(medicationName, subreddits);

    console.error(`[Search] Searching for: "${query}"`);
    console.error(`[Search] Date range: ${startDate} to ${endDate}`);
    console.error(`[Search] Filters: min_comments=${minComments}, min_words=${minWords}`);

    // Acquire rate limit token
    await globalRateLimiter.acquire();

    // Search with exponential backoff
    const searchResults = await withExponentialBackoff(async () => {
      return reddit.search({
        query: query,
        time: 'all',
        sort: 'relevance',
        limit: maxResults * 3 // Get extra to account for filtering
      });
    });

    console.error(`[Search] Found ${searchResults.length} raw results`);

    // Filter and transform results
    const threads = [];

    for (const submission of searchResults) {

      // Skip if before start date or after end date
      const createdTimestamp = submission.created_utc;
      if (createdTimestamp < startTimestamp || createdTimestamp > endTimestamp) {
        continue;
      }

      // Skip if below minimum comments
      if (submission.num_comments < minComments) {
        continue;
      }

      // Get post text (selftext or title)
      const postText = submission.selftext || submission.title || '';
      const wordCount = countWords(postText);

      // Skip if below minimum words
      if (wordCount < minWords) {
        continue;
      }

      // Check if medication is actually mentioned in post
      const fullText = (submission.title + ' ' + postText).toLowerCase();
      if (!fullText.includes(medicationName)) {
        continue;
      }

      // Add to results with anonymized author
      threads.push({
        thread_id: submission.id,
        title: submission.title,
        subreddit: submission.subreddit.display_name,
        author: anonymizeUsername(submission.author.name),
        created_utc: submission.created_utc,
        created_date: new Date(submission.created_utc * 1000).toISOString(),
        score: submission.score,
        num_comments: submission.num_comments,
        url: `https://reddit.com${submission.permalink}`,
        selftext: submission.selftext || '',
        word_count: wordCount
      });

      // Stop if we have enough results
      if (threads.length >= maxResults) {
        break;
      }
    }

    console.error(`[Search] After filtering: ${threads.length} threads match criteria`);

    const result = {
      success: true,
      medication: medicationName,
      subreddits: subreddits,
      date_range: {
        start: startDate,
        end: endDate
      },
      filters: {
        min_comments: minComments,
        min_words: minWords
      },
      count: threads.length,
      threads: threads
    };

    // Handle no results
    if (threads.length === 0) {
      result.message = 'No threads found matching your criteria. Try different search terms or expand the date range.';
    }

    // Cache results
    searchCache.set(cacheKey, result, TTL.SEARCH_RESULTS);

    return result;

  } catch (error) {
    // Provide user-friendly error messages
    if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
      throw new Error(
        'Cannot connect to Reddit. Please check your internet connection and try again.'
      );
    }

    if (error.statusCode === 429 || error.message.includes('rate limit')) {
      throw new Error(
        'Reddit API rate limit reached. Please wait a moment and try again.'
      );
    }

    if (error.message.includes('404')) {
      throw new Error(
        `One or more subreddits not found: ${subreddits.join(', ')}. ` +
        'Please check subreddit names (use names like "pregnant", not "r/pregnant").'
      );
    }

    // Re-throw with context
    throw new Error(`Search failed: ${error.message}`);
  }
}
