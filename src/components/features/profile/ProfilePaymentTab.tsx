'use client';

import React from 'react';
import { LuCreditCard } from 'react-icons/lu';
import { ProfileCardHeader } from './ProfileCardHeader';

export const ProfilePaymentTab = () => {
  return (
    <div className="space-y-6">
      <ProfileCardHeader
        icon={<LuCreditCard className="h-5 w-5 text-primary" />}
        title="Payment Methods"
        description="Manage your saved credit cards and billing preferences."
      />
      <div className="py-12 text-center text-muted-foreground font-medium text-sm">
        Coming soon..
      </div>
    </div>
  );
};
