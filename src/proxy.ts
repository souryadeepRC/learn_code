import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import {
  ROUTE_CONFIG,
  isGuestOnlyRoute,
  isProtectedRoute,
} from '@/config/routes.config';

/**
 * Next.js Edge Middleware for Route Protection
 *
 * Intercepts requests before Server-Side Rendering (SSR) or page loading occurs.
 * This ensures zero UI loading (even for a millisecond) when an authenticated user
 * visits guest routes like /join, or when an unauthenticated user visits protected routes.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user has an active refresh or access token cookie
  const hasSession = Boolean(
    request.cookies.get('refreshToken')?.value ||
    request.cookies.get('accessToken')?.value
  );

  // 1. Authenticated user attempting to access guest-only routes (/join, /forgot-password, etc.)
  // Redirect immediately to defaultAuthRoute without rendering any UI of the guest page.
  if (hasSession && isGuestOnlyRoute(pathname)) {
    return NextResponse.redirect(
      new URL(ROUTE_CONFIG.defaultAuthRoute, request.url)
    );
  }

  // 2. Unauthenticated user attempting to access protected routes (/dashboard, /practice)
  // Redirect immediately to defaultGuestRoute without rendering protected UI.
  if (!hasSession && isProtectedRoute(pathname)) {
    const targetUrl = new URL(ROUTE_CONFIG.defaultGuestRoute, request.url);
    if (ROUTE_CONFIG.defaultGuestRoute === '/join') {
      targetUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(targetUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
