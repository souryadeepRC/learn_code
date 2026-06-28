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
export async function checkRateLimitFixed(
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const cacheKey = `rate:${key}`;

  try {
    // Increment counter
    const count = await redis.incr(cacheKey);

    // Set expiration on first request
    if (count === 1) {
      await redis.expire(cacheKey, windowSeconds);
    }

    // Get TTL for reset time
    const ttl = await redis.ttl(cacheKey);
    const resetTime = now + (ttl > 0 ? ttl : windowSeconds) * 1000;
    const remaining = Math.max(0, maxRequests - count);
    const allowed = count <= maxRequests;

    return {
      allowed,
      remaining,
      resetTime,
      limit: maxRequests,
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    // Fail open: allow request if service is down
    return {
      allowed: true,
      remaining: maxRequests,
      resetTime: now + windowSeconds * 1000,
      limit: maxRequests,
    };
  }
}

/**
 * Sliding Window Counter (More Accurate)
 * - Removes old requests outside window
 * - More accurate but slower
 * - Best for: Security-sensitive endpoints
 */
export async function checkRateLimitSliding(
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const cacheKey = `rate:sliding:${key}`;
  const windowMs = windowSeconds * 1000;
  const windowStart = now - windowMs;

  try {
    // Use pipeline for atomic operations
    const pipeline = redis.pipeline();

    // Remove requests older than window
    pipeline.zremrangebyscore(cacheKey, 0, windowStart);

    // Count requests in current window
    pipeline.zcard(cacheKey);

    // Get TTL
    pipeline.ttl(cacheKey);

    const results = await pipeline.exec();

    const requestCount = (results[1] as number) || 0;
    const ttl = (results[2] as number) || windowSeconds;
    const remaining = Math.max(0, maxRequests - requestCount);
    const allowed = requestCount < maxRequests;

    if (allowed) {
      // Add current request with timestamp as score
      await redis.zadd(cacheKey, {
        score: now,
        member: `${now}-${Math.random()}`,
      });

      // Set expiration
      await redis.expire(cacheKey, windowSeconds);
    }

    const resetTime = now + (ttl > 0 ? ttl : windowSeconds) * 1000;

    return {
      allowed,
      remaining,
      resetTime,
      limit: maxRequests,
    };
  } catch (error) {
    console.error('Sliding window error:', error);
    return {
      allowed: true,
      remaining: maxRequests,
      resetTime: now + windowSeconds * 1000,
      limit: maxRequests,
    };
  }
}

/**
 * Token Bucket Algorithm
 * - Allows burst traffic
 * - Refills over time
 * - Best for: APIs with varying load
 */
export async function checkRateLimitTokenBucket(
  key: string,
  maxTokens: number,
  refillRate: number, // tokens per second
  windowSeconds: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const cacheKey = `bucket:${key}`;

  try {
    // Get stored bucket state
    const bucket = await redis.get(cacheKey);
    let tokens: number;
    let lastRefill: number;

    if (!bucket) {
      // First request
      tokens = maxTokens - 1;
      lastRefill = now;
    } else {
      const [storedTokens, lastRefillStr] = (bucket as string).split(':');
      lastRefill = parseInt(lastRefillStr);

      // Calculate refilled tokens
      const timePassed = (now - lastRefill) / 1000; // seconds
      const refilled = Math.floor(timePassed * refillRate);
      tokens = Math.min(maxTokens, parseInt(storedTokens) + refilled - 1);
    }

    const allowed = tokens > 0;
    const remaining = Math.max(0, tokens);

    // Store updated bucket
    if (allowed) {
      await redis.setex(cacheKey, windowSeconds, `${tokens}:${now}`);
    }

    return {
      allowed,
      remaining,
      resetTime: now + windowSeconds * 1000,
      limit: maxTokens,
    };
  } catch (error) {
    console.error('Token bucket error:', error);
    return {
      allowed: true,
      remaining: maxTokens,
      resetTime: now + windowSeconds * 1000,
      limit: maxTokens,
    };
  }
}

/**
 * Leaky Bucket Algorithm (Queue-based)
 * - Smooths out traffic spikes
 * - Requests processed at fixed rate
 * - Best for: Preventing sudden load spikes
 */
export async function checkRateLimitLeakyBucket(
  key: string,
  capacity: number,
  leakRate: number, // requests per second
  windowSeconds: number
): Promise<RateLimitResult> {
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
}
