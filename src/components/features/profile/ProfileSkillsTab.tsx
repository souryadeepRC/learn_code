'use client';

import React from 'react';
import { LuCode } from 'react-icons/lu';
import { ProfileCardHeader } from './ProfileCardHeader';

export const ProfileSkillsTab = () => {
  return (
    <div className="space-y-6">
      <ProfileCardHeader
        icon={<LuCode className="h-5 w-5 text-primary" />}
        title="Technical Skills"
        description="Add skills and technologies to showcase on your developer profile."
      />
      <div className="py-12 text-center text-muted-foreground font-medium text-sm">
        Coming soon..
      </div>
    </div>
  );
};
