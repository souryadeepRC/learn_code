// Cursor-pagination helpers shared by list endpoints (technologies, notes, ...).
// A cursor is an opaque, base64url-encoded JSON object carrying whatever fields
// the caller needs to resume a sorted query (e.g. { updatedAt, id }).

export const encodeCursor = (payload: Record<string, string>): string =>
  Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');

export const decodeCursor = <T extends Record<string, string>>(
  raw: string | null | undefined
): T | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'));
    if (parsed && typeof parsed === 'object') return parsed as T;
    return null;
  } catch {
    return null;
  }
};

export const clampLimit = (
  raw: string | null | undefined,
  fallback: number,
  max: number
): number => {
  const parsed = parseInt(raw ?? '', 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
};
