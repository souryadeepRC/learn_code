import PageHeader from '@/components/common/PageHeader';
import { TechnologiesGrid } from '@/components/features/technologies/TechnologiesGrid';
import type { Metadata } from 'next';
import { Content } from '../../components/common/Content';

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
    <Content>
      <PageHeader
        title="Technologies"
        description="Discover our full library of technologies — each packed with MCQ
            challenges and coding problems to level up your skills."
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <TechnologiesGrid />
      </div>
    </Content>
  );
};

export default TechnologiesPage;
