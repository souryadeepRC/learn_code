'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * Home Page — AI-Powered Learning Platform
 */
const Home = () => {
  return (
    <main className="relative min-h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden">
      {/* ── Ambient AI Background Glow & Grid Overlay ────────────────── */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)/15_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)/15_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute left-1/2 top-16 -translate-x-1/2 w-[650px] sm:w-[900px] h-[380px] bg-gradient-to-tr from-primary/25 via-secondary/15 to-transparent blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse"
        aria-hidden="true"
      />
      <div
        className="absolute left-1/2 top-32 -translate-x-1/2 w-[350px] h-[180px] bg-primary/20 blur-[80px] rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* ── Hero Section ────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-6 pt-28 pb-20 flex flex-col items-center text-center gap-8 z-10">
        {/* Badge — Futuristic AI Pill */}
        <div className="relative inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/10 dark:bg-primary/15 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary shadow-sm backdrop-blur-md transition-all hover:border-primary/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span>✦ AI-Powered Learning Platform</span>
        </div>

        {/* Headline — Striking Gradient Typography */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] max-w-4xl text-balance">
          Welcome to{' '}
          <span className="relative inline-block whitespace-nowrap">
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent drop-shadow-sm font-black">
              Skill Track AI
            </span>
            <span
              className="absolute -inset-2 bg-gradient-to-r from-primary/25 to-secondary/25 blur-xl -z-10 opacity-70"
              aria-hidden="true"
            />
          </span>
        </h1>

        {/* Subtitle / Description */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed text-balance font-normal">
          Build real-world skills with structured learning paths, AI assistance,
          and a community of developers.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button
            variant="gradient"
            size="lg"
            asChild
            className="group relative h-12 px-8 rounded-xl font-semibold text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Link href="/join" className="flex items-center gap-2">
              <span>Join Us</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Button>
        </div>

        {/* Grounding Accent Divider */}
        <div className="w-full max-w-md mx-auto h-[1px] bg-gradient-to-r from-transparent via-border/50 to-transparent mt-10" />
      </section>
    </main>
  );
};

export default Home;
