'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';

import { ROUTE_CONFIG } from '@/config/routes.config';
import { useCurrentUser } from '@/hooks/use-current-user';
import {
  selectIsAuthenticated,
  selectIsPremium,
} from '@/store/slices/auth-selectors';
import { useAppSelector } from '@/store/store-hooks';

type Props = {
  children: React.ReactNode;
  requiredAccess?: 'public' | 'auth' | 'premium' | 'guest';
};

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * AuthGuard — client-side route protection for Next.js App Router.
 *
 * - Checks if the user is authenticated via Redux store or sessionStorage token.
 * - Redirects unauthenticated users trying to access private routes to `defaultGuestRoute`.
 * - Redirects authenticated users trying to access guest routes (/join) to `defaultAuthRoute`.
 * - Restores user session and profile via useCurrentUser().
 */
export const AuthGuard = ({ children, requiredAccess = 'auth' }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isPremium = useAppSelector(selectIsPremium);
  const { isLoading } = useCurrentUser();
  const isClient = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    if (!isClient) return;
    const token = sessionStorage.getItem('accessToken');
    const isUserAuth = isAuthenticated || Boolean(token);

    if (requiredAccess === 'guest') {
      if (isUserAuth) {
        router.replace(ROUTE_CONFIG.defaultAuthRoute);
      }
      return;
    }

    if (!isUserAuth) {
      if (requiredAccess !== 'public') {
        const guestRoute = ROUTE_CONFIG.defaultGuestRoute;
        const targetUrl =
          guestRoute === '/join'
            ? `${guestRoute}?redirect=${encodeURIComponent(pathname)}`
            : guestRoute;
        router.replace(targetUrl);
      }
      return;
    }

    if (requiredAccess === 'premium' && !isPremium) {
      router.replace(ROUTE_CONFIG.defaultAuthRoute);
    }
  }, [isClient, isAuthenticated, isPremium, requiredAccess, router, pathname]);

  if (!isClient) {
    // If we already know the user is authenticated in memory, never render guest UI
    if (isAuthenticated && requiredAccess === 'guest') {
      return null;
    }
    // During SSR and initial client hydration, render children for public and guest routes,
    // or null for protected routes. This prevents any server/client DOM mismatch.
    if (requiredAccess === 'public' || requiredAccess === 'guest') {
      return <>{children}</>;
    }
    return null;
  }

  if (requiredAccess !== 'public') {
    const token = sessionStorage.getItem('accessToken');
    const isUserAuth = isAuthenticated || Boolean(token);

    if (isLoading && requiredAccess !== 'guest') {
      return (
        <div className="flex min-h-[60vh] w-full items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      );
    }

    if (requiredAccess === 'guest' && isUserAuth) {
      // Return null immediately without loading ANY UI of /join or spinners
      return null;
    }

    if (requiredAccess !== 'guest' && !isUserAuth) {
      return (
        <div className="flex min-h-[60vh] w-full items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      );
    }
  }

  return <>{children}</>;
};
