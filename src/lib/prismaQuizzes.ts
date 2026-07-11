import { PrismaClient } from '@prisma-custom/quizzes';

if (!process.env.QUIZZES_DB_URI) {
  throw new Error('QUIZZES_DB_URI environment variable is not set');
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      quizzesDb: {
        url: process.env.QUIZZES_DB_URI,
      },
    },
    log:
      process.env.NODE_ENV === 'development'
        ? ['info', 'warn', 'error']
        : ['error'],
  });
};

declare global {
  var prismaQuizzes: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prismaQuizzes =
  globalThis.prismaQuizzes ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production')
  globalThis.prismaQuizzes = prismaQuizzes;
