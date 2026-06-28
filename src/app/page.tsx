'use client';

import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Button } from '@/components/ui/button';
import { FaGithub } from 'react-icons/fa';
import { RiLoginCircleLine } from 'react-icons/ri';

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
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">
            Learn
            {/* text-primary auto-switches: #0EA5E9 light → #38BDF8 dark */}
            <span className="text-primary">Code</span>
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
          {/* Gradient still uses hard values — these are decorative and brand-fixed */}
          <span className="bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] bg-clip-text text-transparent">
            Learn Code
          </span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
          Build real-world skills with structured learning paths, AI assistance,
          and a community of developers.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          {/* variant="default" uses bg-primary which auto-switches */}
          <Button size="lg" onClick={connectToGitHub} className="gap-2">
            <FaGithub className="h-5 w-5" />
            Connect with GitHub
          </Button>
          <Button variant="outline" size="lg" onClick={login} className="gap-2">
            <RiLoginCircleLine className="h-5 w-5" />
            Login
          </Button>
        </div>
      </section>

      {/* ── Feature cards ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-24 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            title: 'Structured Paths',
            desc: 'Guided learning tracks from beginner to advanced.',
            icon: '📚',
          },
          {
            title: 'AI Assistant',
            desc: 'Get instant help and code reviews powered by AI.',
            icon: '✨',
          },
          {
            title: 'Real Projects',
            desc: 'Build a portfolio with hands-on, production-grade projects.',
            icon: '🚀',
          },
        ].map(({ title, desc, icon }) => (
          <div
            key={title}
            /* bg-card auto-switches: white light → neutral-900 dark */
            className="rounded-xl border border-border bg-card text-card-foreground p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <span className="text-3xl">{icon}</span>
            <h2 className="text-base font-semibold text-primary">{title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {desc}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
