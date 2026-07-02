'use client';

import React from 'react';
import { LuSettings } from 'react-icons/lu';
import { ProfileCardHeader } from './ProfileCardHeader';

export const ProfileSettingsTab = () => {
  return (
    <div className="space-y-6">
      <ProfileCardHeader
        icon={<LuSettings className="h-5 w-5 text-primary" />}
        title="Account Settings"
        description="Manage your security preferences, notifications, and password."
      />
      <div className="py-12 text-center text-muted-foreground font-medium text-sm">
        Coming soon..
      </div>
    </div>
  );
};
