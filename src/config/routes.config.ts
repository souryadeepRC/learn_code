/**
 * Centralized Application Routing Configuration
 *
 * This configuration allows you to easily change the default fallback/redirect
 * destinations for both authenticated users and guest (unauthenticated) users.
 */

export type RouteConfig = {
  /**
   * Route-1: Default fallback route for authenticated users.
   * When an authenticated user visits guest-only routes (/join, etc.) or a random non-existent route,
   * they will be redirected here.
   */
  defaultAuthRoute: string;

  /**
   * Route-2: Default fallback route for guest (unauthenticated) users.
   * When a guest user attempts to visit protected/authenticated routes or a random non-existent route,
   * they will be redirected here. Can be set to Route-1 ('/technologies') or Route-2 ('/join').
   */
  defaultGuestRoute: string;

  /**
   * Routes accessible ONLY to guest users.
   * Authenticated users visiting these routes will be redirected to `defaultAuthRoute`.
   */
  guestOnlyRoutes: string[];

  /**
   * Protected routes requiring user authentication.
   * Guest users visiting these routes will be redirected to `defaultGuestRoute`.
   */
  protectedRoutes: string[];
};

export const ROUTE_CONFIG: RouteConfig = {
  // Configurable default route for logged-in users (Route-1)
  defaultAuthRoute: '/dashboard',

  // Configurable default route for guest users (Route-1 or Route-2, e.g. '/technologies' or '/join')
  defaultGuestRoute: '/technologies',

  // Routes reserved exclusively for guest users
  guestOnlyRoutes: [
    '/join',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
  ],

  // Protected routes requiring user authentication
  protectedRoutes: ['/dashboard', '/practice'],
};

/**
 * Helper to check if a pathname matches any guest-only route.
 */
export const isGuestOnlyRoute = (pathname: string): boolean => {
  return ROUTE_CONFIG.guestOnlyRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
};

/**
 * Helper to check if a pathname matches any protected route.
 */
export const isProtectedRoute = (pathname: string): boolean => {
  return ROUTE_CONFIG.protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
};
