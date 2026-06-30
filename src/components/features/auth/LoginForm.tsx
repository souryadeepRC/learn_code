'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { RiLoginCircleLine } from 'react-icons/ri';
import SocialAuth from './SocialAuth';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No functionality required yet
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email Address</Label>
          <Input
            autoFocus
            id="login-email"
            type="email"
            placeholder="name@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
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

        <Button type="submit" className="w-full gap-2 mt-4" size="md">
          <RiLoginCircleLine className="h-5 w-5" />
          Sign In
        </Button>

        <div className="flex justify-center mt-2">
          <Button variant="link">Forgot password ?</Button>
        </div>
      </form>
      <SocialAuth />
    </div>
  );
}
