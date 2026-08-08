'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { RiMailSendLine } from 'react-icons/ri';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(
          data.message || 'If an account exists, a reset link has been sent.'
        );
      } else {
        setStatus('error');
        setMessage(data.message || 'An error occurred. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <main className="flex-1 flex flex-col md:flex-row w-full bg-background text-foreground transition-colors duration-300">
      {/* ── Left Side Banner (Image) ── */}
      <section className="relative hidden md:flex flex-col flex-1 bg-muted overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop")',
          }}
        />
        <div className="relative z-10 flex flex-col p-12 mt-auto text-primary drop-shadow-md">
          <h1 className="text-4xl font-bold mb-4">Account Recovery</h1>
          <p className="text-lg opacity-90 max-w-md">
            Get back to your learning path in no time.
          </p>
        </div>
      </section>

      {/* ── Right Side Form Area ── */}
      <section className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-md my-auto py-6">
          <Link
            href="/join"
            className="w-fit inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <IoArrowBack className="h-4 w-4" />
            Back to Login
          </Link>

          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Forgot Password
            </h2>
            <p className="text-muted-foreground">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>
          </div>

          {status === 'success' ? (
            <div className="bg-primary/10 border border-primary/20 text-primary p-4 rounded-lg flex flex-col items-center justify-center space-y-4 text-center">
              <RiMailSendLine className="h-12 w-12" />
              <p>{message}</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/join">Return to Login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoFocus
                />
              </div>

              {status === 'error' && (
                <p className="text-destructive text-sm font-medium">
                  {message}
                </p>
              )}

              <Button
                type="submit"
                className="w-full gap-2"
                size="lg"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default ForgotPasswordPage;
