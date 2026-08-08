import { QueryClient } from '@tanstack/react-query';

let queryClientInstance: QueryClient | null = null;

export function getQueryClient() {
  if (!queryClientInstance) {
    queryClientInstance = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 min
          retry: 1,
        },
        mutations: {
          retry: 0,
        },
      },
    });
  }
  return queryClientInstance;
}

export function resetQueryClient() {
  if (queryClientInstance) {
    queryClientInstance.clear();
  }
}
