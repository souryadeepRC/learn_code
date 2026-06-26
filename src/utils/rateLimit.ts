type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

const getClientIp = (request: Request): string => {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return request.headers.get('x-real-ip') || 'unknown';
};
type RateLimitParams = {
  request: Request;
  key?: string;
  limit: number;
  windowMs: number;
};
export const enforceRateLimit = (options: RateLimitParams) => {
  const { request, key, limit, windowMs } = options;
  const now = Date.now();
  const rateLimitKey = key || getClientIp(request);

  const existing = rateLimitStore.get(rateLimitKey);

  if (existing && existing.resetAt > now) {
    if (existing.count >= limit) {
      return {
        allowed: false,
        retryAfterMs: existing.resetAt - now,
      };
    }

    rateLimitStore.set(rateLimitKey, {
      count: existing.count + 1,
      resetAt: existing.resetAt,
    });

    return {
      allowed: true,
      retryAfterMs: existing.resetAt - now,
    };
  }

  rateLimitStore.set(rateLimitKey, {
    count: 1,
    resetAt: now + windowMs,
  });

  return {
    allowed: true,
    retryAfterMs: 0,
  };
};
