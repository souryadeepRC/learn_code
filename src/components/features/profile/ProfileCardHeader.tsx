'use client';

import React from 'react';

export interface ProfileCardHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
}

export const ProfileCardHeader: React.FC<ProfileCardHeaderProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div className="border-b border-border/40 pb-4">
      <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {description && (
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          {description}
        </p>
      )}
    </div>
  );
};
