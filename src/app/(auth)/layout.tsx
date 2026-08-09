import { AuthGuard } from '@/components/common/AuthGuard';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Authentication | Skill Track AI',
  description:
    'Join Skill Track AI, recover your account, or verify your email.',
};

/**
 * AuthLayout
 *
 * Wraps all authentication pages (/join, /forgot-password, /reset-password, /verify-email)
 * in AuthGuard (guest access) so logged-in users are redirected away.
 * Auth pages intentionally render without the AppShell header/sidebar chrome
 * (that chrome is scoped to the `(app)` route group for authenticated screens).
 */
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard requiredAccess="guest">
      <div className="flex flex-1 flex-col">{children}</div>
    </AuthGuard>
  );
};

export default AuthLayout;
