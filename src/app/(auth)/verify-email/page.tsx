'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from 'react-icons/io5';

const VerifyEmailContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(() =>
    !token ? 'error' : 'loading'
  );
  const [message, setMessage] = useState(() =>
    !token
      ? 'Invalid or missing verification token.'
      : 'Verifying your email address...'
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage(
            'Your email has been successfully verified! You can now log in.'
          );
        } else {
          setStatus('error');
          setMessage(
            data.message || 'Verification failed. The link may be expired.'
          );
        }
      } catch {
        setStatus('error');
        setMessage('An error occurred during verification. Please try again.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="w-full max-w-md p-8 border rounded-xl bg-card shadow-sm text-center">
      <div className="flex justify-center mb-6">
        {status === 'loading' && (
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        )}
        {status === 'success' && (
          <IoCheckmarkCircleOutline className="h-16 w-16 text-green-500" />
        )}
        {status === 'error' && (
          <IoCloseCircleOutline className="h-16 w-16 text-destructive" />
        )}
      </div>

      <h2 className="text-2xl font-bold tracking-tight mb-2">
        {status === 'loading' && 'Verifying Email...'}
        {status === 'success' && 'Email Verified'}
        {status === 'error' && 'Verification Failed'}
      </h2>

      <p className="text-muted-foreground mb-8">{message}</p>

      {status !== 'loading' && (
        <Button asChild className="w-full" size="lg">
          <Link href="/join">Return to Login</Link>
        </Button>
      )}
    </div>
  );
};

const VerifyEmailPage = () => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 w-full bg-background">
      <Suspense
        fallback={
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </main>
  );
};

export default VerifyEmailPage;
