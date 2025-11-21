/**
 * Anonymization Module
 * Implements SHA-256 hashing for username anonymization
 * Ensures privacy protection and IRB compliance
 */

import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Salt for hashing (loaded from environment for reproducibility within study)
 */
const SALT = process.env.ANONYMIZATION_SALT || 'mprint-research-2025';

/**
 * Cache for consistent hashing (same username always produces same hash)
 * Key: original username, Value: anonymized hash
 */
const hashCache = new Map();

/**
 * Anonymize a Reddit username using SHA-256 hashing
 *
 * This function implements IRB-compliant anonymization:
 * - Uses SHA-256 cryptographic hash
 * - Truncates to 8 characters for readability
 * - Maintains consistency (same username → same hash across entire dataset)
 * - Uses configurable salt for reproducibility within study
 *
 * @param {string} username - Original Reddit username
 * @returns {string} Anonymized 8-character hash
 *
 * @example
 * anonymizeUsername('JohnDoe123') // Returns 'a7b3c9d2' (example)
 * anonymizeUsername('JohnDoe123') // Returns 'a7b3c9d2' (same result)
 */
export function anonymizeUsername(username) {
  // Handle null/undefined/empty usernames
  if (!username || username === '[deleted]' || username === '[removed]') {
    return '[deleted]';
  }

  // Check cache first for consistency
  if (hashCache.has(username)) {
    return hashCache.get(username);
  }

  // Create SHA-256 hash
  const hash = crypto
    .createHash('sha256')
    .update(username + SALT)
    .digest('hex')
    .substring(0, 8); // Truncate to 8 characters

  // Cache the result for consistency
  hashCache.set(username, hash);

  return hash;
}

/**
 * Anonymize an array of usernames
 *
 * @param {string[]} usernames - Array of usernames to anonymize
 * @returns {string[]} Array of anonymized hashes
 */
export function anonymizeUsernames(usernames) {
  return usernames.map(username => anonymizeUsername(username));
}

/**
 * Clear the anonymization cache
 * Useful for testing or when starting a new study
 */
export function clearAnonymizationCache() {
  hashCache.clear();
}

/**
 * Get cache size (for monitoring/debugging)
 * @returns {number} Number of cached username mappings
 */
export function getCacheSize() {
  return hashCache.size;
}

/**
 * Anonymize a Reddit post object
 * Replaces author field with anonymized hash
 *
 * @param {Object} post - Reddit post object
 * @returns {Object} Post with anonymized author
 */
export function anonymizePost(post) {
  if (!post) return post;

  return {
    ...post,
    author: post.author ? anonymizeUsername(post.author) : '[deleted]',
    author_original: undefined // Never include original username
  };
}

/**
 * Anonymize a Reddit comment object
 * Replaces author field with anonymized hash
 *
 * @param {Object} comment - Reddit comment object
 * @returns {Object} Comment with anonymized author
 */
export function anonymizeComment(comment) {
  if (!comment) return comment;

  return {
    ...comment,
    author: comment.author ? anonymizeUsername(comment.author) : '[deleted]',
    author_original: undefined // Never include original username
  };
}

/**
 * Anonymize a full thread with all comments
 *
 * @param {Object} thread - Thread object with post and comments
 * @returns {Object} Fully anonymized thread
 */
export function anonymizeThread(thread) {
  if (!thread) return thread;

  const anonymized = {
    ...thread,
    author: thread.author ? anonymizeUsername(thread.author) : '[deleted]'
  };

  // Anonymize all comments if present
  if (thread.comments && Array.isArray(thread.comments)) {
    anonymized.comments = thread.comments.map(comment => anonymizeComment(comment));
  }

  return anonymized;
}

/**
 * Get anonymization metadata for export
 * Provides transparency about anonymization method
 *
 * @returns {Object} Metadata about anonymization
 */
export function getAnonymizationMetadata() {
  return {
    method: 'SHA-256',
    hash_length: 8,
    salt_used: true,
    consistent_hashing: true,
    compliance: 'AoIR Ethics 3.0',
    description: 'All Reddit usernames are anonymized using SHA-256 cryptographic hash with consistent mapping'
  };
}
