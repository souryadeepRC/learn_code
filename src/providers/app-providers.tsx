'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import { store } from '@/store';

type Props = {
  children: React.ReactNode;
};

/**
 * Composing the Redux <Provider> and TanStack <QueryClientProvider> in a
 * single client boundary keeps layout.tsx a pure Server Component.
 *
 * `useState` with an initialiser is the idiomatic way to create a
 * stable QueryClient instance in Next.js App Router — it avoids the
 * "ref.current accessed during render" lint error and is safe for RSC.
 */
export const AppProviders = ({ children }: Props) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 min
            retry: 1,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ReduxProvider>
  );
};
