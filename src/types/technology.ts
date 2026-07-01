// Technology domain types — mirrors the Prisma Technologies model
export type Technology = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  quiz: string[];
  mcqQuestion: number;
  codingQuestion: number;
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
