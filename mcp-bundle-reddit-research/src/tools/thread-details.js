/**
 * Get Thread Details Tool
 * Retrieves full content of a Reddit thread including comments
 */

import { getRedditClient } from '../auth.js';
import { anonymizeUsername, anonymizeComment } from '../privacy/anonymize.js';
import { globalRateLimiter, withExponentialBackoff } from '../utils/rate-limiter.js';
import { threadCache, TTL } from '../utils/cache.js';

/**
 * Extract comment data from Reddit comment object
 * @param {Object} comment - Reddit comment object
 * @returns {Object} Simplified comment data
 */
function extractCommentData(comment) {
  // Handle deleted/removed comments
  if (!comment || !comment.author) {
    return {
      comment_id: comment?.id || 'unknown',
      author: '[deleted]',
      body: '[deleted]',
      created_utc: comment?.created_utc || 0,
      created_date: comment?.created_utc
        ? new Date(comment.created_utc * 1000).toISOString()
        : null,
      score: comment?.score || 0
    };
  }

  return {
    comment_id: comment.id,
    author: anonymizeUsername(comment.author.name),
    body: comment.body || '',
    created_utc: comment.created_utc,
    created_date: new Date(comment.created_utc * 1000).toISOString(),
    score: comment.score
  };
}

/**
 * Recursively flatten comment tree
 * @param {Array} comments - Reddit comment listing
 * @param {number} maxComments - Maximum number of comments to extract
 * @returns {Array} Flattened comments
 */
function flattenComments(comments, maxComments) {
  const flattened = [];

  for (const comment of comments) {
    // Skip MoreComments objects
    if (comment.constructor.name === 'MoreComments') {
      continue;
    }

    // Add this comment
    flattened.push(extractCommentData(comment));

    // Stop if we have enough
    if (flattened.length >= maxComments) {
      break;
    }

    // Add replies recursively
    if (comment.replies && comment.replies.length > 0) {
      const remainingSlots = maxComments - flattened.length;
      if (remainingSlots > 0) {
        const replyComments = flattenComments(comment.replies, remainingSlots);
        flattened.push(...replyComments);
      }
    }

    // Stop if we have enough
    if (flattened.length >= maxComments) {
      break;
    }
  }

  return flattened;
}

/**
 * Get full details of a Reddit thread including comments
 *
 * @param {Object} params - Parameters
 * @param {string} params.thread_id - Reddit thread ID (e.g., 'abc123')
 * @param {boolean} [params.include_comments=true] - Include comments
 * @param {number} [params.max_comments=50] - Maximum comments to retrieve
 * @param {string} [params.sort_by='top'] - Comment sort order ('top', 'best', 'new')
 * @returns {Promise<Object>} Thread details
 */
export async function getThreadDetails(params) {
  // Validate required parameters
  if (!params.thread_id) {
    throw new Error('thread_id is required');
  }

  const threadId = params.thread_id;
  const includeComments = params.include_comments ?? true;
  const maxComments = params.max_comments ?? 50;
  const sortBy = params.sort_by || 'top';

  // Validate sort_by
  const validSorts = ['top', 'best', 'new'];
  if (!validSorts.includes(sortBy)) {
    throw new Error(
      `sort_by must be one of: ${validSorts.join(', ')}. Received: "${sortBy}"`
    );
  }

  // Check cache
  const cacheKey = `${threadId}_${includeComments}_${maxComments}_${sortBy}`;
  const cached = threadCache.get(cacheKey);
  if (cached) {
    console.error('[Thread Cache] Hit - returning cached thread');
    return cached;
  }

  try {
    // Get Reddit client
    const reddit = await getRedditClient();

    console.error(`[Thread Details] Fetching thread: ${threadId}`);

    // Acquire rate limit token
    await globalRateLimiter.acquire();

    // Fetch submission with exponential backoff
    const submission = await withExponentialBackoff(async () => {
      return reddit.getSubmission(threadId);
    });

    // Check if thread exists
    if (!submission.id) {
      throw new Error('Thread not found or has been deleted');
    }

    // Build basic thread data
    const threadData = {
      thread_id: submission.id,
      title: submission.title,
      subreddit: submission.subreddit.display_name,
      author: submission.author
        ? anonymizeUsername(submission.author.name)
        : '[deleted]',
      created_utc: submission.created_utc,
      created_date: new Date(submission.created_utc * 1000).toISOString(),
      score: submission.score,
      num_comments: submission.num_comments,
      url: `https://reddit.com${submission.permalink}`,
      selftext: submission.selftext || '',
      is_deleted: submission.removed_by_category !== null,
      comments: []
    };

    // Fetch comments if requested
    if (includeComments && threadData.num_comments > 0) {
      console.error(`[Thread Details] Fetching up to ${maxComments} comments (sort: ${sortBy})`);

      // Acquire another rate limit token for comments
      await globalRateLimiter.acquire();

      // Expand comments with proper sorting
      await withExponentialBackoff(async () => {
        await submission.expandReplies({ limit: maxComments, depth: 10 });
      });

      // Sort comments
      let comments = submission.comments;
      if (sortBy === 'top') {
        comments = comments.sort((a, b) => b.score - a.score);
      } else if (sortBy === 'new') {
        comments = comments.sort((a, b) => b.created_utc - a.created_utc);
      }
      // 'best' is default Reddit sorting, no need to re-sort

      // Flatten and extract comments
      threadData.comments = flattenComments(comments, maxComments);

      console.error(`[Thread Details] Extracted ${threadData.comments.length} comments`);
    }

    const result = {
      success: true,
      thread: threadData
    };

    // Add warnings for deleted content
    if (threadData.is_deleted) {
      result.warning = 'This thread has been deleted or removed by moderators. Content may be incomplete.';
    }

    // Cache the result
    threadCache.set(cacheKey, result, TTL.THREAD_CONTENT);

    return result;

  } catch (error) {
    // Provide user-friendly error messages
    if (error.message.includes('404') || error.message.includes('not found')) {
      throw new Error(
        'Thread not found or has been deleted. Please check the thread_id.'
      );
    }

    if (error.message.includes('403') || error.message.includes('Forbidden')) {
      throw new Error(
        'Cannot access this thread. It may be private or restricted.'
      );
    }

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

    // Re-throw with context
    throw new Error(`Failed to retrieve thread details: ${error.message}`);
  }
}
