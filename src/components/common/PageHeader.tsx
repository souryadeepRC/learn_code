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
    <div className="  bg-background/95 backdrop-blur-sm border-b px-4 sm:px-6 py-3 flex items-center justify-between">
      <div>
        {icon}
        <h1 className="text-lg font-bold text-primary tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Button {...actionCta} />
    </div>
  );
};

export default PageHeader;
