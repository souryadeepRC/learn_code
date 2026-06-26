const failureStore = new Map<string, { count: number; lockedUntil: number }>();

export const getFailureState = (key: string) => failureStore.get(key);

export const recordFailure = (key: string) => {
  const now = Date.now();
  const existing = failureStore.get(key);

  if (existing && existing.lockedUntil > now) {
    return { blocked: true, retryAfterMs: existing.lockedUntil - now };
  }

  if (existing && existing.count >= 4) {
    const lockedUntil = now + 15 * 60 * 1000;
    failureStore.set(key, { count: 1, lockedUntil });
    return { blocked: true, retryAfterMs: 15 * 60 * 1000 };
  }

  const nextCount = existing ? existing.count + 1 : 1;
  failureStore.set(key, {
    count: nextCount,
    lockedUntil: now,
  });

  return { blocked: false, retryAfterMs: 0 };
};

export const clearFailureState = (key: string) => {
  failureStore.delete(key);
};
