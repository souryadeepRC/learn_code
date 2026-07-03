import { PrismaClient } from '@prisma-custom/notes';

if (!process.env.NOTES_DB_URI) {
  throw new Error('NOTES_DB_URI environment variable is not set');
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      notesDb: {
        url: process.env.NOTES_DB_URI,
      },
    },
    log:
      process.env.NODE_ENV === 'development'
        ? ['info', 'warn', 'error']
        : ['error'],
  });
};

declare global {
  var prismaNotes: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prismaNotes = globalThis.prismaNotes ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaNotes = prismaNotes;
