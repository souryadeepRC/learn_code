import { PrismaClient } from '@prisma-custom/challenges';

if (!process.env.CHALLENGES_DB_URI) {
  throw new Error('CHALLENGES_DB_URI environment variable is not set');
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      challengesDb: {
        url: process.env.CHALLENGES_DB_URI,
      },
    },
    log:
      process.env.NODE_ENV === 'development'
        ? ['info', 'warn', 'error']
        : ['error'],
  });
};

declare global {
  var prismaChallenges: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prismaChallenges =
  globalThis.prismaChallenges ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production')
  globalThis.prismaChallenges = prismaChallenges;
