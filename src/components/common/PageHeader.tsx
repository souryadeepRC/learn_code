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
    <div className="px-4 pb-3 sm:px-6 flex items-center justify-between">
      <div>
        <h1 className="flex gap-2 text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight sm:leading-tight md:leading-tight lg:leading-tight font-bold text-primary ">
          {icon} {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm md:text-md text-muted-foreground   max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actionCta && <Button {...actionCta} />}
    </div>
  );
};

export default PageHeader;
