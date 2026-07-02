'use client';

import React from 'react';
import { LuMapPin } from 'react-icons/lu';
import { ProfileCardHeader } from './ProfileCardHeader';

export const ProfileAddressTab = () => {
  return (
    <div className="space-y-6">
      <ProfileCardHeader
        icon={<LuMapPin className="h-5 w-5 text-primary" />}
        title="Saved Addresses"
        description="Manage your billing and mailing addresses."
      />
      <div className="py-12 text-center text-muted-foreground font-medium text-sm">
        Coming soon..
      </div>
    </div>
  );
};
