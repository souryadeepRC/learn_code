import { PrismaClient } from '@prisma-custom/learning-paths';

if (!process.env.LEARNING_PATHS_DB_URI) {
  throw new Error('LEARNING_PATHS_DB_URI environment variable is not set');
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      learningPathsDb: {
        url: process.env.LEARNING_PATHS_DB_URI,
      },
    },
    log:
      process.env.NODE_ENV === 'development'
        ? ['info', 'warn', 'error']
        : ['error'],
  });
};

declare global {
  var prismaLearningPaths: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prismaLearningPaths =
  globalThis.prismaLearningPaths ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production')
  globalThis.prismaLearningPaths = prismaLearningPaths;
