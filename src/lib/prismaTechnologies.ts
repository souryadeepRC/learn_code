import { PrismaClient } from '@prisma-custom/technologies';

if (!process.env.TECHNOLOGIES_DB_URI) {
  throw new Error('TECHNOLOGIES_DB_URI environment variable is not set');
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      techDb: {
        url: process.env.TECHNOLOGIES_DB_URI,
      },
    },
    log:
      process.env.NODE_ENV === 'development'
        ? ['info', 'warn', 'error']
        : ['error'],
  });
};

declare global {
  var prismaTechnologies: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prismaTechnologies =
  globalThis.prismaTechnologies ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production')
  globalThis.prismaTechnologies = prismaTechnologies;
