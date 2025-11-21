/**
 * Get Subreddit Info Tool
 * Retrieves information about a subreddit (subscribers, description, rules)
 */

import { getRedditClient } from '../auth.js';
import { globalRateLimiter, withExponentialBackoff } from '../utils/rate-limiter.js';
import { subredditCache, TTL } from '../utils/cache.js';

/**
 * Get information about a subreddit
 *
 * @param {Object} params - Parameters
 * @param {string} params.subreddit_name - Name of subreddit (without r/ prefix)
 * @returns {Promise<Object>} Subreddit information
 */
export async function getSubredditInfo(params) {
  // Validate required parameters
  if (!params.subreddit_name) {
    throw new Error('subreddit_name is required');
  }

  // Clean subreddit name (remove r/ if present)
  const subredditName = params.subreddit_name.toLowerCase().replace(/^r\//, '');

  // Check cache
  const cached = subredditCache.get(subredditName);
  if (cached) {
    console.error('[Subreddit Cache] Hit - returning cached info');
    return cached;
  }

  try {
    // Get Reddit client
    const reddit = await getRedditClient();

    console.error(`[Subreddit Info] Fetching info for: r/${subredditName}`);

    // Acquire rate limit token
    await globalRateLimiter.acquire();

    // Fetch subreddit with exponential backoff
    const subreddit = await withExponentialBackoff(async () => {
      return reddit.getSubreddit(subredditName);
    });

    // Fetch subreddit details
    await subreddit.fetch();

    // Extract rules (may require separate API call)
    let rules = [];
    try {
      await globalRateLimiter.acquire();
      const rulesData = await withExponentialBackoff(async () => {
        return subreddit.getRules();
      });

      rules = rulesData.rules.map(rule => ({
        short_name: rule.short_name,
        description: rule.description,
        violation_reason: rule.violation_reason
      }));

    } catch (error) {
      console.error(`[Subreddit Info] Could not fetch rules: ${error.message}`);
      rules = [];
    }

    // Build subreddit info
    const info = {
      success: true,
      subreddit: {
        name: subreddit.display_name,
        title: subreddit.title,
        description: subreddit.public_description,
        subscribers: subreddit.subscribers,
        active_users: subreddit.active_user_count || 0,
        created_utc: subreddit.created_utc,
        created_date: new Date(subreddit.created_utc * 1000).toISOString(),
        is_nsfw: subreddit.over18,
        submission_type: subreddit.submission_type, // 'any', 'link', 'self'
        url: `https://reddit.com/r/${subreddit.display_name}`,
        rules: rules
      }
    };

    // Cache the result
    subredditCache.set(subredditName, info, TTL.SUBREDDIT_INFO);

    return info;

  } catch (error) {
    // Provide user-friendly error messages
    if (error.message.includes('404') || error.message.includes('not found')) {
      throw new Error(
        `Subreddit "r/${subredditName}" not found. ` +
        'Please check the name (use names like "pregnant", not "r/pregnant").'
      );
    }

    if (error.message.includes('403') || error.message.includes('Forbidden')) {
      throw new Error(
        `Cannot access r/${subredditName}. It may be private or restricted.`
      );
    }

    if (error.message.includes('banned')) {
      throw new Error(
        `Subreddit r/${subredditName} has been banned or quarantined.`
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
    throw new Error(`Failed to retrieve subreddit info: ${error.message}`);
  }
}
