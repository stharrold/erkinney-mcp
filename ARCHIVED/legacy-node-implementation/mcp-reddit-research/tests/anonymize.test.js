/**
 * Tests for anonymization module
 * Verifies SHA-256 hashing, consistency, and privacy features
 */

import {
  anonymizeUsername,
  anonymizeUsernames,
  clearAnonymizationCache,
  getCacheSize,
  anonymizePost,
  anonymizeComment,
  anonymizeThread,
  getAnonymizationMetadata
} from '../src/privacy/anonymize.js';

describe('Anonymization Module', () => {
  beforeEach(() => {
    // Clear cache before each test for isolation
    clearAnonymizationCache();
  });

  describe('anonymizeUsername', () => {
    test('produces consistent hash for same username', () => {
      const hash1 = anonymizeUsername('testuser123');
      const hash2 = anonymizeUsername('testuser123');
      expect(hash1).toBe(hash2);
    });

    test('produces different hashes for different usernames', () => {
      const hash1 = anonymizeUsername('user1');
      const hash2 = anonymizeUsername('user2');
      expect(hash1).not.toBe(hash2);
    });

    test('returns 8-character hash', () => {
      const hash = anonymizeUsername('testuser');
      expect(hash).toHaveLength(8);
      expect(/^[a-f0-9]{8}$/.test(hash)).toBe(true);
    });

    test('handles deleted usernames', () => {
      expect(anonymizeUsername('[deleted]')).toBe('[deleted]');
      expect(anonymizeUsername('[removed]')).toBe('[deleted]');
      expect(anonymizeUsername(null)).toBe('[deleted]');
      expect(anonymizeUsername(undefined)).toBe('[deleted]');
      expect(anonymizeUsername('')).toBe('[deleted]');
    });

    test('uses cache for performance', () => {
      anonymizeUsername('cacheduser');
      expect(getCacheSize()).toBe(1);

      anonymizeUsername('cacheduser'); // Should hit cache
      expect(getCacheSize()).toBe(1); // Still 1 entry
    });
  });

  describe('anonymizeUsernames', () => {
    test('anonymizes array of usernames', () => {
      const usernames = ['user1', 'user2', 'user3'];
      const hashes = anonymizeUsernames(usernames);

      expect(hashes).toHaveLength(3);
      expect(hashes[0]).toHaveLength(8);
      expect(hashes[1]).toHaveLength(8);
      expect(hashes[2]).toHaveLength(8);

      // All should be different
      expect(new Set(hashes).size).toBe(3);
    });

    test('handles empty array', () => {
      expect(anonymizeUsernames([])).toEqual([]);
    });
  });

  describe('anonymizePost', () => {
    test('anonymizes post author', () => {
      const post = {
        id: 'abc123',
        author: 'testauthor',
        title: 'Test Post',
        body: 'Post content'
      };

      const anonymized = anonymizePost(post);
      expect(anonymized.author).toHaveLength(8);
      expect(anonymized.author).not.toBe('testauthor');
      expect(anonymized.title).toBe('Test Post');
      expect(anonymized.body).toBe('Post content');
    });

    test('handles null post', () => {
      expect(anonymizePost(null)).toBeNull();
    });

    test('handles deleted author', () => {
      const post = { id: 'abc123', author: null };
      const anonymized = anonymizePost(post);
      expect(anonymized.author).toBe('[deleted]');
    });

    test('removes original author field', () => {
      const post = { id: 'abc123', author: 'testauthor' };
      const anonymized = anonymizePost(post);
      expect(anonymized.author_original).toBeUndefined();
    });
  });

  describe('anonymizeComment', () => {
    test('anonymizes comment author', () => {
      const comment = {
        id: 'def456',
        author: 'commentauthor',
        body: 'Comment text'
      };

      const anonymized = anonymizeComment(comment);
      expect(anonymized.author).toHaveLength(8);
      expect(anonymized.author).not.toBe('commentauthor');
      expect(anonymized.body).toBe('Comment text');
    });

    test('handles null comment', () => {
      expect(anonymizeComment(null)).toBeNull();
    });
  });

  describe('anonymizeThread', () => {
    test('anonymizes thread with comments', () => {
      const thread = {
        id: 'thread123',
        author: 'threadauthor',
        title: 'Thread Title',
        comments: [
          { id: 'c1', author: 'user1', body: 'Comment 1' },
          { id: 'c2', author: 'user2', body: 'Comment 2' }
        ]
      };

      const anonymized = anonymizeThread(thread);

      // Check thread author anonymized
      expect(anonymized.author).toHaveLength(8);
      expect(anonymized.author).not.toBe('threadauthor');

      // Check comments anonymized
      expect(anonymized.comments).toHaveLength(2);
      expect(anonymized.comments[0].author).toHaveLength(8);
      expect(anonymized.comments[1].author).toHaveLength(8);
      expect(anonymized.comments[0].author).not.toBe('user1');
      expect(anonymized.comments[1].author).not.toBe('user2');
    });

    test('handles thread without comments', () => {
      const thread = { id: 'thread123', author: 'threadauthor', title: 'Thread Title' };
      const anonymized = anonymizeThread(thread);
      expect(anonymized.author).toHaveLength(8);
    });

    test('handles null thread', () => {
      expect(anonymizeThread(null)).toBeNull();
    });
  });

  describe('getAnonymizationMetadata', () => {
    test('returns correct metadata', () => {
      const metadata = getAnonymizationMetadata();

      expect(metadata.method).toBe('SHA-256');
      expect(metadata.hash_length).toBe(8);
      expect(metadata.salt_used).toBe(true);
      expect(metadata.consistent_hashing).toBe(true);
      expect(metadata.compliance).toBe('AoIR Ethics 3.0');
      expect(metadata.description).toContain('SHA-256');
    });
  });

  describe('cache management', () => {
    test('clearAnonymizationCache resets cache', () => {
      anonymizeUsername('user1');
      anonymizeUsername('user2');
      expect(getCacheSize()).toBe(2);

      clearAnonymizationCache();
      expect(getCacheSize()).toBe(0);
    });

    test('getCacheSize returns correct count', () => {
      expect(getCacheSize()).toBe(0);
      anonymizeUsername('user1');
      expect(getCacheSize()).toBe(1);
      anonymizeUsername('user2');
      expect(getCacheSize()).toBe(2);
      anonymizeUsername('user1'); // Cache hit
      expect(getCacheSize()).toBe(2);
    });
  });
});
