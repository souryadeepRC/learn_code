'use client';

import { selectUserProfile } from '@/store/slices/userSelectors';
import { useAppSelector } from '@/store/storeHooks';
import React, { useState } from 'react';
import { FaArrowAltCircleRight } from 'react-icons/fa';
import {
  LuCode,
  LuCreditCard,
  LuMapPin,
  LuSettings,
  LuUser,
} from 'react-icons/lu';
import { ProfileAddressTab } from './ProfileAddressTab';
import { ProfileGeneralTab } from './ProfileGeneralTab';
import { ProfilePaymentTab } from './ProfilePaymentTab';
import { ProfileSettingsTab } from './ProfileSettingsTab';
import { ProfileSkillsTab } from './ProfileSkillsTab';

type TabOption = 'profile' | 'address' | 'payment' | 'skills' | 'settings';

type TabItem = {
  id: TabOption;
  label: string;
  icon: React.ElementType;
};

const TAB_ITEMS: TabItem[] = [
  { id: 'profile', label: 'Profile', icon: LuUser },
  { id: 'address', label: 'Address', icon: LuMapPin },
  { id: 'payment', label: 'Payment', icon: LuCreditCard },
  { id: 'skills', label: 'Skills', icon: LuCode },
  { id: 'settings', label: 'Settings', icon: LuSettings },
];

export const ProfileTabsView = () => {
  const [activeTab, setActiveTab] = useState<TabOption>('profile');
  const profile = useAppSelector(selectUserProfile);
  const profileKey = profile?.id ?? 'guest';

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start w-full max-w-full min-w-0">
      {/* ── Left Panel (Desktop) / Horizontal Tabs (Mobile) ── */}
      <div className="flex flex-col gap-1.5 w-full md:w-56 shrink-0">
        {/* Mobile UX Indicator: Shows users that tabs can be swiped horizontally */}
        <div className="flex items-center justify-end text-[11px] text-muted-foreground font-medium md:hidden px-1">
          <span className="flex items-center gap-1 text-primary/80 animate-pulse">
            Swipe for more <FaArrowAltCircleRight />
          </span>
        </div>

        <div className="relative w-full">
          <nav
            aria-label="Profile navigation"
            className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 w-full max-w-full min-w-0 shrink-0 scrollbar-none"
          >
            {TAB_ITEMS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer flex items-center gap-2 px-3.5 py-2.5 border-0 rounded-lg  text-xs md:text-sm transition-all whitespace-nowrap shrink-0 md:w-full font-medium ${
                    isActive
                      ? 'text-primary  bg-primary/10 font-semibold'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground  '
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Subtle right gradient indicator for horizontal scrolling on mobile */}
          <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
        </div>
      </div>

      {/* ── Right Content Panel ── */}
      <div className="flex-1 min-w-0 w-full max-w-full rounded-xl py-2 px-6 md:px-8 shadow-none">
        {activeTab === 'profile' && <ProfileGeneralTab key={profileKey} />}
        {activeTab === 'address' && <ProfileAddressTab key={profileKey} />}
        {activeTab === 'payment' && <ProfilePaymentTab />}
        {activeTab === 'skills' && <ProfileSkillsTab />}
        {activeTab === 'settings' && <ProfileSettingsTab />}
      </div>
    </div>
  );
};
