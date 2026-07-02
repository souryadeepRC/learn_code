import { PrismaClient } from '@prisma-custom/users';

if (!process.env.USERS_DB_URI) {
  throw new Error('USERS_DB_URI environment variable is not set');
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      usersDb: {
        url: process.env.USERS_DB_URI,
      },
    },
    log:
      process.env.NODE_ENV === 'development'
        ? ['info', 'warn', 'error']
        : ['error'],
  });
};

declare global {
  var prismaUsers: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prismaUsers = globalThis.prismaUsers ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaUsers = prismaUsers;
