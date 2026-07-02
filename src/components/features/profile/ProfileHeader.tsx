'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { selectUserInitials } from '@/store/slices/authSelectors';
import {
  selectUserProfile,
  selectUserProfileInitials,
} from '@/store/slices/userSelectors';
import { useAppSelector } from '@/store/storeHooks';
import { LuFrown } from 'react-icons/lu';

export const ProfileHeader = () => {
  const profile = useAppSelector(selectUserProfile);
  const profileInitials = useAppSelector(selectUserProfileInitials);
  const emailInitials = useAppSelector(selectUserInitials);

  const displayInitials = profileInitials || emailInitials || 'U';
  const hasFirstName = Boolean(profile?.firstName?.trim());

  return (
    <>
      <div className="flex items-center gap-5 text-left sm:text-left">
        {/* Circle Box for Profile Image */}
        <Avatar className="h-15 md:h-20 w-15 md:w-20 border border-border shadow-none">
          <AvatarImage
            src={profile?.imageUrl ?? ''}
            alt={profile?.firstName ?? 'User avatar'}
            className="object-cover"
          />
          <AvatarFallback className="bg-secondary text-secondary-foreground text-xl font-semibold">
            {displayInitials}
          </AvatarFallback>
        </Avatar>

        {/* User Name Section */}
        <div className="flex justify-center ">
          {hasFirstName ? (
            <h1 className="text-xl md:text-3xl font-bold text-primary tracking-tight">
              Hey, {profile?.firstName}
            </h1>
          ) : (
            <div className="flex items-center justify-center sm:justify-start gap-2 text-amber-600 dark:text-amber-400 font-medium text-lg">
              <LuFrown className="h-5 w-5 shrink-0" />
              <span>Please Set your Name</span>
            </div>
          )}
        </div>
      </div>

      <Separator />
    </>
  );
};
