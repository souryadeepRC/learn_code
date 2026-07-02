import { RateLimitConfig } from '@/root/src/types/common';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  limit: number;
}

/**
 * Fixed Window Counter (Simplest)
 * - Resets at fixed time intervals
 * - Less accurate but faster
 * - Best for: High traffic scenarios
 */
export const checkRateLimitFixed = async (
  config: RateLimitConfig
): Promise<RateLimitResult> => {
  const { key, maxRequests, windowSeconds } = config;
  const now = Date.now();
  const cacheKey = `rate:${key}`;

  try {
    // Increment counter
    const count = await redis.incr(cacheKey);

    // Set expiration on first request
    if (count === 1) {
      await redis.expire(cacheKey, windowSeconds);
    }

    // Get time remaining
    const ttl = await redis.ttl(cacheKey);
    const reset = now + (ttl > 0 ? ttl : windowSeconds) * 1000;

    const remaining = Math.max(0, maxRequests - count);

    return {
      allowed: count <= maxRequests,
      limit: maxRequests,
      remaining,
      resetTime: reset,
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    // Open fail-safe (allow request if Redis fails)
    return {
      allowed: true,
      limit: maxRequests,
      remaining: 1,
      resetTime: now + windowSeconds * 1000,
    };
  }
};

/**
 * Sliding Window Counter (More Accurate)
 * - Removes old requests outside window
 * - More accurate but slower
 * - Best for: Security-sensitive endpoints
 */
export const checkRateLimitSliding = async (
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<RateLimitResult> => {
  const now = Date.now();
  const cacheKey = `rate:sliding:${key}`;
  const windowMs = windowSeconds * 1000;
  const windowStart = now - windowMs;

  try {
    // 1. Remove timestamps outside the window
    await redis.zremrangebyscore(cacheKey, 0, windowStart);

    // 2. Add current timestamp
    await redis.zadd(cacheKey, {
      score: now,
      member: `${now}-${Math.random()}`,
    });

    // 3. Count total requests in current window
    const count = await redis.zcard(cacheKey);

    // 4. Set TTL to prevent memory leaks
    await redis.expire(cacheKey, windowSeconds);

    const remaining = Math.max(0, maxRequests - count);
    const reset = now + windowMs;

    return {
      allowed: count <= maxRequests,
      limit: maxRequests,
      remaining,
      resetTime: reset,
    };
  } catch (error) {
    console.error('Sliding window rate limit error:', error);
    return {
      allowed: true,
      limit: maxRequests,
      remaining: 1,
      resetTime: now + windowMs,
    };
  }
};

/**
 * Token Bucket Algorithm
 * - Allows burst traffic
 * - Refills over time
 * - Best for: APIs with varying load
 */
export const checkRateLimitTokenBucket = async (
  key: string,
  maxTokens: number,
  refillRate: number, // tokens per second
  windowSeconds: number
): Promise<RateLimitResult> => {
  const now = Date.now();
  const cacheKey = `bucket:${key}`;

  try {
    // Get current bucket state
    const bucketData = await redis.hgetall(cacheKey);

    let tokens = maxTokens;
    let lastRefill = now;

    if (bucketData && bucketData.tokens) {
      tokens = parseFloat(bucketData.tokens as string);
      lastRefill = parseInt(bucketData.lastRefill as string, 10);

      // Calculate tokens to add based on elapsed time
      const elapsedSeconds = (now - lastRefill) / 1000;
      const tokensToAdd = elapsedSeconds * refillRate;
      tokens = Math.min(maxTokens, tokens + tokensToAdd);
    }

    const success = tokens >= 1;
    if (success) {
      tokens -= 1;
    }

    // Update bucket state
    await redis.hset(cacheKey, {
      tokens: tokens.toString(),
      lastRefill: now.toString(),
    });
    await redis.expire(cacheKey, windowSeconds);

    return {
      allowed: success,
      limit: maxTokens,
      remaining: Math.floor(tokens),
      resetTime: now + windowSeconds * 1000,
    };
  } catch (error) {
    console.error('Token bucket rate limit error:', error);
    return {
      allowed: true,
      limit: maxTokens,
      remaining: 1,
      resetTime: now + windowSeconds * 1000,
    };
  }
};

/**
 * Leaky Bucket Algorithm (Queue-based)
 * - Smooths out traffic spikes
 * - Requests processed at fixed rate
 * - Best for: Preventing sudden load spikes
 */
export const checkRateLimitLeakyBucket = async (
  key: string,
  capacity: number,
  leakRate: number, // requests per second
  windowSeconds: number
): Promise<RateLimitResult> => {
  const now = Date.now();
  const cacheKey = `leak:${key}`;

  try {
    const bucket = await redis.get(cacheKey);
    let water: number; // Current queue size
    let lastLeak: number;

    if (!bucket) {
      water = 1;
      lastLeak = now;
    } else {
      const [waterStr, lastLeakStr] = (bucket as string).split(':');
      lastLeak = parseInt(lastLeakStr);

      // Calculate leaked requests
      const timePassed = (now - lastLeak) / 1000;
      const leaked = Math.floor(timePassed * leakRate);
      water = Math.max(0, parseInt(waterStr) - leaked + 1);
    }

    const allowed = water <= capacity;
    const remaining = Math.max(0, capacity - water);

    if (allowed) {
      await redis.setex(cacheKey, windowSeconds, `${water}:${now}`);
    }

    return {
      allowed,
      remaining,
      resetTime: now + windowSeconds * 1000,
      limit: capacity,
    };
  } catch (error) {
    console.error('Leaky bucket error:', error);
    return {
      allowed: true,
      remaining: capacity,
      resetTime: now + windowSeconds * 1000,
      limit: capacity,
    };
  }
};
