import { createHash } from 'crypto';

export type AuthSessionSource = 'oauth' | 'credentials' | 'current';

export type AuthSession = {
  id: string;
  userId: string;
  provider: string;
  source: AuthSessionSource;
  deviceLabel?: string;
  createdAt: string;
  lastActiveAt: string;
  revoked: boolean;
};

const sessionsByUser = new Map<string, AuthSession[]>();

const createSessionId = (userId: string, source: AuthSessionSource) => {
  return createHash('sha256')
    .update(`${userId}:${source}:${Date.now()}`)
    .digest('hex')
    .slice(0, 24);
};

export const createAuthSession = (
  userId: string,
  options?: {
    provider?: string;
    source?: AuthSessionSource;
    deviceLabel?: string;
  }
): AuthSession => {
  const source = options?.source ?? 'current';
  const existingSessions = sessionsByUser.get(userId) ?? [];
  const existingActiveSession = existingSessions.find(
    (session) => session.source === source && !session.revoked
  );

  if (existingActiveSession) {
    return existingActiveSession;
  }

  const session: AuthSession = {
    id: createSessionId(userId, source),
    userId,
    provider: options?.provider ?? 'credentials',
    source,
    deviceLabel: options?.deviceLabel,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    revoked: false,
  };

  existingSessions.push(session);
  sessionsByUser.set(userId, existingSessions);

  return session;
};

export const listAuthSessions = (userId: string): AuthSession[] => {
  return (sessionsByUser.get(userId) ?? []).filter(
    (session) => !session.revoked
  );
};

export const revokeAuthSession = (
  userId: string,
  sessionId: string
): boolean => {
  const existingSessions = sessionsByUser.get(userId) ?? [];
  const targetSession = existingSessions.find(
    (session) => session.id === sessionId
  );

  if (!targetSession) {
    return false;
  }

  targetSession.revoked = true;
  targetSession.lastActiveAt = new Date().toISOString();
  sessionsByUser.set(userId, existingSessions);

  return true;
};
