'use client';

import { ROUTE_CONFIG } from '@/config/routesConfig';
import { selectIsAuthenticated } from '@/store/slices/authSelectors';
import { useAppSelector } from '@/store/storeHooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * NotFound Page — intercepts any random / non-existent route.
 * Automatically redirects logged-in users to `defaultAuthRoute`
 * and guest users to `defaultGuestRoute`.
 */
const NotFound = () => {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('accessToken')
        : null;

    if (isAuthenticated || Boolean(token)) {
      router.replace(ROUTE_CONFIG.defaultAuthRoute);
    } else {
      router.replace(ROUTE_CONFIG.defaultGuestRoute);
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-muted-foreground">
          Redirecting to default route...
        </p>
      </div>
    </div>
  );
};

export default NotFound;
