/**
 * Reddit Authentication Module
 * Handles OAuth 2.0 authentication with Reddit API using snoowrap
 */

import snoowrap from 'snoowrap';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Reddit client instance (singleton)
 */
let redditClient = null;

/**
 * Create and authenticate Reddit client
 * @returns {Promise<snoowrap>} Authenticated Reddit client
 * @throws {Error} If authentication fails or credentials are missing
 */
export async function createRedditClient() {
  // Return existing client if already authenticated
  if (redditClient) {
    return redditClient;
  }

  // Validate required environment variables
  const requiredVars = [
    'REDDIT_CLIENT_ID',
    'REDDIT_CLIENT_SECRET',
    'REDDIT_USERNAME',
    'REDDIT_PASSWORD',
    'REDDIT_USER_AGENT'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      'Please check your .env file and ensure all Reddit credentials are set.'
    );
  }

  try {
    // Create snoowrap client with OAuth credentials
    redditClient = new snoowrap({
      userAgent: process.env.REDDIT_USER_AGENT,
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      username: process.env.REDDIT_USERNAME,
      password: process.env.REDDIT_PASSWORD
    });

    // Configure snoowrap settings
    redditClient.config({
      requestDelay: 1000, // 1 second between requests
      warnings: false,
      continueAfterRatelimitError: true,
      retryErrorCodes: [502, 503, 504, 522],
      maxRetryAttempts: 3
    });

    // Test authentication by fetching user info
    try {
      await redditClient.getMe();
    } catch (error) {
      redditClient = null;
      throw new Error(
        'Authentication failed. Please check your REDDIT_USERNAME and REDDIT_PASSWORD.'
      );
    }

    return redditClient;

  } catch (error) {
    redditClient = null;

    // Provide user-friendly error messages
    if (error.message.includes('invalid_grant')) {
      throw new Error(
        'Authentication failed. Your Reddit username or password is incorrect. ' +
        'Please verify your credentials in the .env file.'
      );
    }

    if (error.message.includes('Unauthorized')) {
      throw new Error(
        'Authentication failed. Please check your REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET. ' +
        'These should match the values from https://www.reddit.com/prefs/apps'
      );
    }

    if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
      throw new Error(
        'Cannot connect to Reddit. Please check your internet connection and try again.'
      );
    }

    // Re-throw with original error if no specific handling
    throw error;
  }
}

/**
 * Get existing Reddit client or create new one
 * @returns {Promise<snoowrap>} Authenticated Reddit client
 */
export async function getRedditClient() {
  if (!redditClient) {
    return await createRedditClient();
  }
  return redditClient;
}

/**
 * Clear cached Reddit client (useful for testing or re-authentication)
 */
export function clearRedditClient() {
  redditClient = null;
}

/**
 * Check if Reddit client is authenticated
 * @returns {boolean} True if authenticated
 */
export function isAuthenticated() {
  return redditClient !== null;
}
