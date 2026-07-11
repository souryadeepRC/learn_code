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
 * The header/sidebar chrome comes from the root AppShell.
 */
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard requiredAccess="guest">
      <div className="flex flex-1 flex-col">{children}</div>
    </AuthGuard>
  );
};

export default AuthLayout;
