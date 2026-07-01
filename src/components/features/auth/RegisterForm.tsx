'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { RiUserAddLine } from 'react-icons/ri';
import SocialAuth from './SocialAuth';

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No functionality required yet
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="register-email">Email Address</Label>
          <Input
            autoFocus
            id="register-email"
            type="email"
            placeholder="name@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <div className="relative">
            <Input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              required
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
          <Label htmlFor="register-confirm-password">Confirm Password</Label>
          <div className="relative">
            <Input
              id="register-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {showConfirmPassword ? (
                <LuEyeOff className="h-4 w-4" />
              ) : (
                <LuEye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full gap-2 mt-4" size="lg">
          <RiUserAddLine className="h-5 w-5" />
          Create Account
        </Button>
      </form>

      <SocialAuth />
      <p className="text-center text-xs text-muted-foreground mt-4">
        By continuing, you agree to our{' '}
        <a
          href="#"
          className="underline hover:text-foreground rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          href="#"
          className="underline hover:text-foreground rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};
