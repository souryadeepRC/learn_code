'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';

import { store } from '@/store';
import { getQueryClient } from '@/lib/queryClient';

type Props = {
  children: React.ReactNode;
};

export const AppProviders = ({ children }: Props) => {
  const queryClient = getQueryClient();

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ReduxProvider>
  );
};
