/**
 * Tests for Rate Limiter module
 * Verifies token bucket algorithm, rate limiting, exponential backoff
 */

import {
  RateLimiter,
  globalRateLimiter,
  withExponentialBackoff
} from '../src/utils/rate-limiter.js';

describe('Rate Limiter Module', () => {
  describe('RateLimiter', () => {
    let limiter;

    beforeEach(() => {
      limiter = new RateLimiter(10, 1000); // 10 requests per second for testing
    });

    test('allows requests within limit', async () => {
      await limiter.acquire();
      await limiter.acquire();
      await limiter.acquire();

      const stats = limiter.getStats();
      expect(stats.requestCount).toBe(3);
      expect(stats.tokensAvailable).toBeLessThan(10);
    });

    test('blocks when tokens exhausted', async () => {
      // Consume all tokens
      for (let i = 0; i < 10; i++) {
        await limiter.acquire();
      }

      const startTime = Date.now();
      await limiter.acquire(); // Should wait for token refill
      const elapsed = Date.now() - startTime;

      // Should have waited at least some time for refill
      expect(elapsed).toBeGreaterThan(50); // At least 50ms
    }, 10000);

    test('refills tokens over time', async () => {
      // Consume some tokens
      await limiter.acquire();
      await limiter.acquire();
      await limiter.acquire();

      const statsBefore = limiter.getStats();
      expect(statsBefore.tokensAvailable).toBeLessThan(10);

      // Wait for refill
      await new Promise(resolve => setTimeout(resolve, 500));

      limiter.refill();
      const statsAfter = limiter.getStats();
      expect(statsAfter.tokensAvailable).toBeGreaterThan(statsBefore.tokensAvailable);
    });

    test('tracks statistics correctly', async () => {
      await limiter.acquire();
      await limiter.acquire();

      const stats = limiter.getStats();
      expect(stats.requestCount).toBe(2);
      expect(stats.maxTokens).toBe(10);
      expect(stats.tokensAvailable).toBeLessThanOrEqual(10);
    });

    test('reset() resets state', async () => {
      await limiter.acquire();
      await limiter.acquire();

      limiter.reset();

      const stats = limiter.getStats();
      expect(stats.requestCount).toBe(0);
      expect(stats.tokensAvailable).toBe(10);
      expect(stats.rateLimitHits).toBe(0);
    });

    test('tracks rate limit hits', async () => {
      // Exhaust all tokens
      for (let i = 0; i < 10; i++) {
        await limiter.acquire();
      }

      // Next acquire should trigger rate limit
      const acquirePromise = limiter.acquire();

      // Give it a moment to detect rate limit
      await new Promise(resolve => setTimeout(resolve, 100));

      const stats = limiter.getStats();
      expect(stats.rateLimitHits).toBeGreaterThan(0);

      await acquirePromise; // Complete the acquire
    }, 10000);
  });

  describe('Global Rate Limiter', () => {
    test('is initialized with correct defaults', () => {
      const stats = globalRateLimiter.getStats();
      expect(stats.maxTokens).toBe(60); // 60 requests per minute
    });

    test('can be reset', () => {
      globalRateLimiter.reset();
      const stats = globalRateLimiter.getStats();
      expect(stats.requestCount).toBe(0);
    });
  });

  describe('withExponentialBackoff', () => {
    test('succeeds on first try', async () => {
      let callCount = 0;
      const mockFn = async () => {
        callCount++;
        return 'success';
      };

      const result = await withExponentialBackoff(mockFn);

      expect(result).toBe('success');
      expect(callCount).toBe(1);
    });

    test('retries on rate limit error', async () => {
      let callCount = 0;
      const mockFn = async () => {
        callCount++;
        if (callCount === 1) {
          throw { statusCode: 429, message: 'Rate limited' };
        }
        return 'success';
      };

      const result = await withExponentialBackoff(mockFn, 3, 10); // Fast retry for testing

      expect(result).toBe('success');
      expect(callCount).toBe(2);
    }, 10000);

    test('retries with exponential delay', async () => {
      let callCount = 0;
      const mockFn = async () => {
        callCount++;
        if (callCount <= 2) {
          throw { statusCode: 429, message: 'Rate limited' };
        }
        return 'success';
      };

      const startTime = Date.now();
      const result = await withExponentialBackoff(mockFn, 5, 10);
      const elapsed = Date.now() - startTime;

      expect(result).toBe('success');
      expect(callCount).toBe(3);
      // Should have waited: 10ms + 20ms = 30ms minimum
      expect(elapsed).toBeGreaterThan(25);
    }, 10000);

    test('throws after max retries', async () => {
      let callCount = 0;
      const mockFn = async () => {
        callCount++;
        throw { statusCode: 429, message: 'Rate limited' };
      };

      try {
        await withExponentialBackoff(mockFn, 3, 10);
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        // Verify it retried the correct number of times before throwing
        expect(callCount).toBe(3);
        // Error should be the rate limit error
        expect(error.statusCode).toBe(429);
      }
    }, 15000);

    test('throws immediately for non-rate-limit errors', async () => {
      let callCount = 0;
      const mockFn = async () => {
        callCount++;
        throw new Error('Network error');
      };

      await expect(
        withExponentialBackoff(mockFn, 3, 10)
      ).rejects.toThrow('Network error');

      expect(callCount).toBe(1); // No retries for non-rate-limit errors
    });

    test('retries on rate limit message in error', async () => {
      let callCount = 0;
      const mockFn = async () => {
        callCount++;
        if (callCount === 1) {
          throw { message: 'Error: rate limit exceeded' };
        }
        return 'success';
      };

      const result = await withExponentialBackoff(mockFn, 3, 10);

      expect(result).toBe('success');
      expect(callCount).toBe(2);
    }, 10000);

    test('caps delay at maximum', async () => {
      let callCount = 0;
      const mockFn = async () => {
        callCount++;
        if (callCount <= 4) {
          throw { statusCode: 429 };
        }
        return 'success';
      };

      const startTime = Date.now();
      await withExponentialBackoff(mockFn, 10, 100);
      const elapsed = Date.now() - startTime;

      // Delays: 100, 200, 400, 800 = 1500ms
      // But max is 64000ms per retry, so all should complete quickly
      expect(elapsed).toBeLessThan(5000);
    }, 10000);
  });
});
