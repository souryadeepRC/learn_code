'use client';

import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { IoArrowBack, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { LuEye, LuEyeOff } from 'react-icons/lu';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (!token) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg text-center">
        <p>Invalid or missing reset token.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/forgot-password">Request New Link</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Your password has been successfully reset.');
        // Optionally redirect after a few seconds
        setTimeout(() => router.push('/join'), 3000);
      } else {
        setStatus('error');
        setMessage(data.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('An error occurred. Please try again later.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 p-6 rounded-lg flex flex-col items-center justify-center space-y-4 text-center">
        <IoCheckmarkCircleOutline className="h-12 w-12" />
        <p className="text-lg font-medium">{message}</p>
        <p className="text-sm opacity-90">Redirecting to login...</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/join">Go to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {showPassword ? (
              <LuEyeOff className="h-4 w-4" />
            ) : (
              <LuEye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
        </div>
      </div>

      {status === 'error' && (
        <p className="text-destructive text-sm font-medium">{message}</p>
      )}

      <Button
        type="submit"
        className="w-full gap-2"
        size="md"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Resetting...' : 'Reset Password'}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col md:flex-row transition-colors duration-300">
      <section className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12 relative h-screen overflow-y-auto">
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <Link
            href="/join"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <IoArrowBack className="h-4 w-4" />
            Back to Login
          </Link>
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md mt-16 md:mt-0">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Set New Password</h2>
            <p className="text-muted-foreground">
              Please enter your new password below.
            </p>
          </div>

          <Suspense fallback={<p>Loading...</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
