'use client';

import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * Home Page
 *
 * Background and text use single semantic tokens that auto-switch:
 *   bg-background   → #F9FAFB (light)  /  #030712 (dark)   [colors.ts neutral-50 / neutral-950]
 *   bg-primary      → #0EA5E9 (light)  /  #38BDF8 (dark)   [colors.ts primary-500 / primary-400]
 *   text-foreground → #030712 (light)  /  #F9FAFB (dark)   [colors.ts neutral-950 / neutral-50]
 *
 * No "dark:" prefix needed anywhere — ThemeContext adds .dark to <html>
 * and CSS custom properties switch automatically.
 */
export default function Home() {
  const connectToGitHub = () => {
    window.location.href = '/api/auth/oauth/authorize/github';
  };

  const login = async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@email.com', password: 'Test@1234' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    alert(JSON.stringify(data));
  };

  return (
    /*
     * bg-background is the single token for page background.
     * It reads --background which is #F9FAFB in light and #030712 in dark.
     * No dark: variant needed — it switches automatically via CSS vars.
     */
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* ── Navigation ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground ">
            Learn
            <span className="text-primary transition-colors duration-300">
              Code
            </span>
          </span>
          <ThemeToggle />
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-16 flex flex-col items-center text-center gap-8">
        {/* Badge — uses accent token: primary-50 light / primary-950 dark */}
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-accent text-accent-foreground px-4 py-1.5 text-xs font-medium">
          ✦ AI-Powered Learning Platform
        </span>

        <h1 className="text-5xl font-bold tracking-tight leading-tight max-w-2xl">
          Welcome to{' '}
          {/* Gradient now dynamically uses globals.css CSS variables (primary and secondary) */}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Learn Code
          </span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
          Build real-world skills with structured learning paths, AI assistance,
          and a community of developers.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <Button variant="gradient" size="lg" asChild className="gap-2">
            <Link href="/join">Join Us</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
