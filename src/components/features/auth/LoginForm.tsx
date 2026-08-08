'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks/useLogin';
import { cn } from '@/root/src/utils';
import { loginSchema } from '@/schema/auth';
import type { LoginCredentials } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoIosAlert } from 'react-icons/io';
import { LuEye, LuEyeOff, LuLoader } from 'react-icons/lu';
import { RiLoginCircleLine } from 'react-icons/ri';
import SocialAuth from './SocialAuth';

// ── Field error message ────────────────────────────────────────────────────

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="flex items-center gap-1.5 text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200"
    >
      <RiLoginCircleLine className="h-3 w-3 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
};

// ── API error banner ───────────────────────────────────────────────────────

const ApiErrorBanner = ({ message }: { message: string }) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-in fade-in slide-in-from-top-2 duration-300"
    >
      <IoIosAlert className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
};

// ── Login Form ─────────────────────────────────────────────────────────────

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const { mutate: login, isPending, error: apiError, isError } = useLogin();

  const isBusy = isPending || isSubmitting;

  const onSubmit = (data: LoginCredentials) => {
    login(data);
  };

  return (
    <div className="space-y-6">
      {/* API-level error banner */}
      {isError && apiError?.message && (
        <ApiErrorBanner message={apiError.message} />
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
        aria-label="Login form"
      >
        {/* ── Email ── */}
        <div className="space-y-1">
          <Label htmlFor="login-email">Email Address</Label>
          <Input
            autoFocus
            id="login-email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            className={cn(
              errors.email &&
                'border-destructive focus-visible:ring-destructive/30'
            )}
            {...register('email')}
          />
          <div id="login-email-error">
            <FieldError message={errors.email?.message} />
          </div>
        </div>

        {/* ── Password ── */}
        <div className="space-y-1">
          <Label htmlFor="login-password">Password</Label>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? 'login-password-error' : undefined
              }
              className={cn(
                'pr-10',
                errors.password &&
                  'border-destructive focus-visible:ring-destructive/30'
              )}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background p-1"
            >
              {showPassword ? (
                <LuEyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <LuEye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          <div id="login-password-error">
            <FieldError message={errors.password?.message} />
          </div>
        </div>

        {/* ── Submit ── */}
        <Button
          type="submit"
          className="w-full gap-2 mt-4"
          size="lg"
          disabled={isBusy}
          aria-busy={isBusy}
        >
          {isBusy ? (
            <>
              <LuLoader className="h-4 w-4 animate-spin" aria-hidden="true" />
              Signing in…
            </>
          ) : (
            <>
              <RiLoginCircleLine className="h-5 w-5" aria-hidden="true" />
              Sign In
            </>
          )}
        </Button>

        {/* ── Forgot password ── */}
        <div className="flex justify-center mt-2">
          <Link href="/forgot-password">Forgot password? </Link>
        </div>
      </form>

      <SocialAuth />
    </div>
  );
};
