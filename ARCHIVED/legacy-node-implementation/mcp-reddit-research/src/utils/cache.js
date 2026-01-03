/**
 * LRU Cache Module
 * Implements Least Recently Used cache to reduce redundant API calls
 */

/**
 * LRU (Least Recently Used) Cache
 * Automatically evicts least recently used items when full
 */
export class LRUCache {
  /**
   * Create an LRU cache
   * @param {number} maxSize - Maximum number of items to cache (default: 100)
   */
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get an item from cache
   * @param {string} key - Cache key
   * @returns {*|null} Cached value or null if not found/expired
   */
  get(key) {
    if (!this.cache.has(key)) {
      this.misses++;
      return null;
    }

    const item = this.cache.get(key);

    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, item);

    this.hits++;
    return item.value;
  }

  /**
   * Set an item in cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  set(key, value, ttl) {
    // Remove existing key if present
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Evict oldest item if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    // Add new item with expiry
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }

  /**
   * Check if key exists in cache (without updating recency)
   * @param {string} key - Cache key
   * @returns {boolean} True if key exists and not expired
   */
  has(key) {
    if (!this.cache.has(key)) {
      return false;
    }

    const item = this.cache.get(key);
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete an item from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Clear all items from cache
   */
  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cache statistics
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: this.hits + this.misses > 0
        ? (this.hits / (this.hits + this.misses) * 100).toFixed(2) + '%'
        : '0%'
    };
  }
}

/**
 * Cache TTL constants
 */
export const TTL = {
  THREAD_CONTENT: 5 * 60 * 1000,    // 5 minutes
  SUBREDDIT_INFO: 60 * 60 * 1000,   // 1 hour
  SEARCH_RESULTS: 10 * 60 * 1000    // 10 minutes
};

/**
 * Global caches for different data types
 */
export const threadCache = new LRUCache(100);
export const subredditCache = new LRUCache(50);
export const searchCache = new LRUCache(100);

/**
 * Clear all caches
 */
export function clearAllCaches() {
  threadCache.clear();
  subredditCache.clear();
  searchCache.clear();
}

/**
 * Get statistics for all caches
 * @returns {Object} Combined statistics
 */
export function getAllCacheStats() {
  return {
    threads: threadCache.getStats(),
    subreddits: subredditCache.getStats(),
    searches: searchCache.getStats()
  };
}
