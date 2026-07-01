import { AppHeader } from '@/components/common/AppHeader';
import { AuthGuard } from '@/components/common/AuthGuard';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Authentication | Learn Code',
  description: 'Join Learn Code, recover your account, or verify your email.',
};

/**
 * AuthLayout
 *
 * Wraps all authentication pages (/join, /forgot-password, /reset-password, /verify-email)
 * with the sticky AppHeader at the top level so individual pages don't need to copy-paste header code.
 * Also wraps children in AuthGuard (guest access) so logged-in users are redirected away.
 */
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <AppHeader />
      <AuthGuard requiredAccess="guest">
        <div className="flex-1 flex flex-col">{children}</div>
      </AuthGuard>
    </div>
  );
};

export default AuthLayout;
