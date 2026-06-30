export type RateLimitConfig = {
  key: string;
  maxRequests: number;
  windowSeconds: number;
};
