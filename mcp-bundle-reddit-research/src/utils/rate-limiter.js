/**
 * Rate Limiter Module
 * Implements token bucket algorithm to respect Reddit's API limits (60 requests/minute)
 */

/**
 * Sleep utility function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Token Bucket Rate Limiter
 * Ensures we don't exceed Reddit's API rate limits
 */
export class RateLimiter {
  /**
   * Create a rate limiter
   * @param {number} maxRequests - Maximum requests allowed in time window (default: 60)
   * @param {number} timeWindow - Time window in milliseconds (default: 60000 = 1 minute)
   */
  constructor(maxRequests = 60, timeWindow = 60000) {
    this.tokens = maxRequests;
    this.maxTokens = maxRequests;
    this.timeWindow = timeWindow;
    this.refillRate = maxRequests / timeWindow; // tokens per millisecond
    this.lastRefill = Date.now();
    this.requestCount = 0;
    this.rateLimitHits = 0;
  }

  /**
   * Refill tokens based on elapsed time
   */
  refill() {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = elapsed * this.refillRate;

    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  /**
   * Acquire a token (wait if necessary)
   * @returns {Promise<void>}
   */
  async acquire() {
    this.refill();

    // If no tokens available, wait until we have one
    if (this.tokens < 1) {
      const waitTime = (1 - this.tokens) / this.refillRate;

      // Log rate limit event
      this.rateLimitHits++;
      console.error(`[Rate Limiter] Pausing for ${Math.ceil(waitTime / 1000)}s to respect rate limits...`);

      await sleep(waitTime);
      this.refill();
    }

    // Consume one token
    this.tokens -= 1;
    this.requestCount++;
  }

  /**
   * Get rate limiter statistics
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      tokensAvailable: Math.floor(this.tokens),
      maxTokens: this.maxTokens,
      requestCount: this.requestCount,
      rateLimitHits: this.rateLimitHits
    };
  }

  /**
   * Reset rate limiter
   */
  reset() {
    this.tokens = this.maxTokens;
    this.lastRefill = Date.now();
    this.requestCount = 0;
    this.rateLimitHits = 0;
  }
}

/**
 * Global rate limiter instance
 */
export const globalRateLimiter = new RateLimiter();

/**
 * Exponential backoff utility for handling 429 responses
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries (default: 5)
 * @param {number} initialDelay - Initial delay in ms (default: 1000)
 * @returns {Promise<*>} Result of function call
 */
export async function withExponentialBackoff(fn, maxRetries = 5, initialDelay = 1000) {
  let delay = initialDelay;
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if it's a rate limit error (429)
      if (error.statusCode === 429 || error.message.includes('rate limit')) {
        if (attempt < maxRetries - 1) {
          console.error(
            `[Exponential Backoff] Rate limited. Retrying in ${delay / 1000}s ` +
            `(attempt ${attempt + 1}/${maxRetries})...`
          );

          await sleep(delay);
          delay = Math.min(delay * 2, 64000); // Max 64 seconds
          continue;
        }
      }

      // If not a rate limit error or last attempt, throw
      throw error;
    }
  }

  throw new Error(
    `Failed after ${maxRetries} attempts. Last error: ${lastError.message}`
  );
}
