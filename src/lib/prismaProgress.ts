import { PrismaClient } from '@prisma-custom/progress';

if (!process.env.PROGRESS_DB_URI) {
  throw new Error('PROGRESS_DB_URI environment variable is not set');
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      progressDb: {
        url: process.env.PROGRESS_DB_URI,
      },
    },
    log:
      process.env.NODE_ENV === 'development'
        ? ['info', 'warn', 'error']
        : ['error'],
  });
};

declare global {
  var prismaProgress: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prismaProgress =
  globalThis.prismaProgress ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production')
  globalThis.prismaProgress = prismaProgress;
