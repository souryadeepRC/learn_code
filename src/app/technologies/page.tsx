import { Content } from '@/components/common/Content';
import { Heading } from '@/components/common/Heading';
import { TechnologiesGrid } from '@/root/src/components/features/technologies/TechnologiesGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technologies | Skill Track AI',
  description:
    'Explore all available technologies, MCQ challenges, and coding problems. Browse our growing library to sharpen your skills.',
};

/**
 * /technologies — publicly accessible page (no auth required).
 * Uses a Client Component for the interactive infinite-scroll grid.
 */
const TechnologiesPage = () => {
  return (
    <main id="main-content" className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-3">
          {/* Headline */}
          <Heading variant="h1">Technologies</Heading>

          {/* Subtitle */}
          <Content size="default" className="max-w-2xl">
            Discover our full library of technologies — each packed with MCQ
            challenges and coding problems to level up your skills.
          </Content>
        </header>

        {/* ── Infinite scroll grid ── */}
        <TechnologiesGrid />
      </div>
    </main>
  );
};

export default TechnologiesPage;
