/**
 * Tests for LRU Cache module
 * Verifies caching behavior, TTL, eviction policy
 */

import {
  LRUCache,
  TTL,
  threadCache,
  subredditCache,
  searchCache,
  clearAllCaches,
  getAllCacheStats
} from '../src/utils/cache.js';

describe('LRU Cache Module', () => {
  let cache;

  beforeEach(() => {
    cache = new LRUCache(3); // Small cache for testing
  });

  describe('LRUCache', () => {
    test('stores and retrieves values', () => {
      cache.set('key1', 'value1', 1000);
      expect(cache.get('key1')).toBe('value1');
    });

    test('returns null for non-existent key', () => {
      expect(cache.get('nonexistent')).toBeNull();
    });

    test('respects TTL expiration', async () => {
      cache.set('key1', 'value1', 100); // 100ms TTL
      expect(cache.get('key1')).toBe('value1');

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(cache.get('key1')).toBeNull();
    });

    test('evicts oldest item when full (LRU)', () => {
      cache.set('key1', 'value1', 5000);
      cache.set('key2', 'value2', 5000);
      cache.set('key3', 'value3', 5000);

      // Cache is full (size 3), adding 4th item should evict key1
      cache.set('key4', 'value4', 5000);

      expect(cache.get('key1')).toBeNull(); // Evicted
      expect(cache.get('key2')).toBe('value2');
      expect(cache.get('key3')).toBe('value3');
      expect(cache.get('key4')).toBe('value4');
    });

    test('updates recency on get (moves to end)', () => {
      cache.set('key1', 'value1', 5000);
      cache.set('key2', 'value2', 5000);
      cache.set('key3', 'value3', 5000);

      // Access key1 (makes it most recent)
      cache.get('key1');

      // Add 4th item - should evict key2 (now oldest)
      cache.set('key4', 'value4', 5000);

      expect(cache.get('key1')).toBe('value1'); // Still present
      expect(cache.get('key2')).toBeNull(); // Evicted
      expect(cache.get('key3')).toBe('value3');
      expect(cache.get('key4')).toBe('value4');
    });

    test('has() checks existence without updating recency', () => {
      cache.set('key1', 'value1', 5000);
      cache.set('key2', 'value2', 5000);
      cache.set('key3', 'value3', 5000);

      expect(cache.has('key1')).toBe(true);

      // Add 4th item - key1 should still be evicted (has() doesn't update recency)
      cache.set('key4', 'value4', 5000);

      expect(cache.has('key1')).toBe(false); // Evicted
    });

    test('delete() removes item', () => {
      cache.set('key1', 'value1', 5000);
      expect(cache.get('key1')).toBe('value1');

      cache.delete('key1');
      expect(cache.get('key1')).toBeNull();
    });

    test('clear() empties cache', () => {
      cache.set('key1', 'value1', 5000);
      cache.set('key2', 'value2', 5000);

      cache.clear();

      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
    });

    test('tracks cache statistics', () => {
      cache.set('key1', 'value1', 5000);

      cache.get('key1'); // Hit
      cache.get('key2'); // Miss
      cache.get('key1'); // Hit
      cache.get('key3'); // Miss

      const stats = cache.getStats();
      expect(stats.size).toBe(1);
      expect(stats.maxSize).toBe(3);
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(2);
      expect(stats.hitRate).toBe('50.00%');
    });

    test('handles expired items in has()', async () => {
      cache.set('key1', 'value1', 100); // 100ms TTL
      expect(cache.has('key1')).toBe(true);

      await new Promise(resolve => setTimeout(resolve, 150));
      expect(cache.has('key1')).toBe(false); // Expired
    });

    test('overwrites existing key', () => {
      cache.set('key1', 'value1', 5000);
      cache.set('key1', 'value2', 5000);

      expect(cache.get('key1')).toBe('value2');
    });
  });

  describe('TTL Constants', () => {
    test('defines appropriate TTL values', () => {
      expect(TTL.THREAD_CONTENT).toBe(5 * 60 * 1000); // 5 minutes
      expect(TTL.SUBREDDIT_INFO).toBe(60 * 60 * 1000); // 1 hour
      expect(TTL.SEARCH_RESULTS).toBe(10 * 60 * 1000); // 10 minutes
    });
  });

  describe('Global Caches', () => {
    beforeEach(() => {
      clearAllCaches();
    });

    test('threadCache is initialized', () => {
      expect(threadCache).toBeInstanceOf(LRUCache);
      const stats = threadCache.getStats();
      expect(stats.maxSize).toBe(100);
    });

    test('subredditCache is initialized', () => {
      expect(subredditCache).toBeInstanceOf(LRUCache);
      const stats = subredditCache.getStats();
      expect(stats.maxSize).toBe(50);
    });

    test('searchCache is initialized', () => {
      expect(searchCache).toBeInstanceOf(LRUCache);
      const stats = searchCache.getStats();
      expect(stats.maxSize).toBe(100);
    });

    test('clearAllCaches clears all caches', () => {
      threadCache.set('t1', 'thread1', 5000);
      subredditCache.set('s1', 'sub1', 5000);
      searchCache.set('q1', 'search1', 5000);

      clearAllCaches();

      expect(threadCache.get('t1')).toBeNull();
      expect(subredditCache.get('s1')).toBeNull();
      expect(searchCache.get('q1')).toBeNull();
    });

    test('getAllCacheStats returns combined stats', () => {
      threadCache.set('t1', 'thread1', 5000);
      threadCache.get('t1'); // Hit

      subredditCache.set('s1', 'sub1', 5000);
      subredditCache.get('nonexistent'); // Miss

      const allStats = getAllCacheStats();

      expect(allStats.threads).toBeDefined();
      expect(allStats.subreddits).toBeDefined();
      expect(allStats.searches).toBeDefined();

      expect(allStats.threads.size).toBe(1);
      expect(allStats.threads.hits).toBe(1);
      expect(allStats.subreddits.misses).toBe(1);
    });
  });
});
