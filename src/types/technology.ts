// Technology domain types — mirrors the Prisma Technology model
// (prisma/technologies/technologies.schema.prisma)

export type DifficultyLevel =
  | 'BEGINNER'
  | 'INTERMEDIATE'
  | 'ADVANCED'
  | 'EXPERT';

export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type TechnologyContentCounts = {
  quizCount: number;
  noteCount: number;
  challengeCount: number;
};

export type Technology = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  categoryId: string;
  difficulty: DifficultyLevel;
  prerequisiteIds: string[];
  tags: string[];
  isFeatured: boolean;
  isPremium: boolean;
  status: ContentStatus;
  cachedContentCounts: TechnologyContentCounts | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  order: number;
};

export type TechnologiesMeta = {
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
};

export type TechnologiesApiResponse = {
  data: Technology[];
  meta: TechnologiesMeta;
};
