'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Technology } from '@/types/technology';
import { formatNumber } from '@/utils/common';
import React from 'react';

type Props = {
  technology: Technology;
};

const TechnologyCardComponent = (props: Props) => {
  const { name, description, cachedContentCounts } = props.technology;
  const { quizCount = 0, noteCount = 0, challengeCount = 0 } =
    cachedContentCounts ?? {};

  return (
    <Card
      className="py-4 sm:py-8 px-5
      justify-between
      transition-all duration-300 ease-out
      cursor-pointer hover:shadow-xl hover:shadow-primary/10  hover:border-primary/50
      focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 outline-none"
      aria-label={`Technology: ${name}`}
      tabIndex={0}
    >
      <CardHeader>
        <CardTitle className="text-lg font-bold">{name}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-4 sm:pt-8 flex flex-wrap gap-2">
        <Badge>{formatNumber(quizCount)} Quiz</Badge>
        <Badge>{formatNumber(challengeCount)} Coding</Badge>
        <Badge>{formatNumber(noteCount)} Notes</Badge>
      </CardContent>
    </Card>
  );
};

export const TechnologyCard = React.memo(TechnologyCardComponent);
