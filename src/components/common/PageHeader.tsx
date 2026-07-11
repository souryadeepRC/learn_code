'use client';

import Button from '@/components/common/Button';
import React from 'react';

interface Props {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  actionCta?: React.ComponentProps<typeof Button>;
}

const PageHeader: React.FC<Props> = ({
  title,
  description,
  icon,
  actionCta,
}) => {
  return (
    <div className="px-4 sm:px-6 py-6 flex items-center justify-between">
      <div>
        <h1 className="flex gap-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight sm:leading-tight md:leading-tight lg:leading-tight font-bold text-primary ">
          {icon} {title}
        </h1>
        {description && (
          <p className="text-base sm:text-sm md:text-md text-muted-foreground pt-2 max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actionCta && <Button {...actionCta} />}
    </div>
  );
};

export default PageHeader;
