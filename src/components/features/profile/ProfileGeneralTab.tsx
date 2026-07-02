'use client';

import { FormInput } from '@/components/common/FormInput';
import { Button } from '@/components/ui/button';
import { useSaveProfile } from '@/hooks/useProfile';
import { selectUserProfile } from '@/store/slices/userSelectors';
import { useAppSelector } from '@/store/storeHooks';
import React, { useState } from 'react';
import { LuCheck, LuLoader, LuSave, LuUser } from 'react-icons/lu';
import { ProfileCardHeader } from './ProfileCardHeader';

export const ProfileGeneralTab = () => {
  const profile = useAppSelector(selectUserProfile);

  const [firstName, setFirstName] = useState(() => profile?.firstName ?? '');
  const [lastName, setLastName] = useState(() => profile?.lastName ?? '');
  const [email, setEmail] = useState(() => profile?.email ?? '');
  const [phoneNumber, setPhoneNumber] = useState(
    () => profile?.phoneNumber ?? ''
  );
  const [bio, setBio] = useState(() => profile?.bio ?? '');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    mutate: saveProfile,
    isPending,
    error,
  } = useSaveProfile({
    onSuccessCallback: () => {
      setSuccessMessage('Profile updated successfully.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    saveProfile({
      email,
      firstName,
      lastName,
      phoneNumber: phoneNumber || null,
      imageUrl: profile?.imageUrl ?? null,
      bio: bio || null,
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <ProfileCardHeader
        icon={<LuUser className="h-5 w-5 text-primary" />}
        title="General Profile"
        description="Manage your personal information"
      />

      {error && (
        <div className="rounded-xl bg-destructive/15 border border-destructive/30 p-4 text-sm text-destructive font-medium animate-fadeIn">
          {error.message}
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl bg-green-500/15 border border-green-500/30 p-4 text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-2 animate-fadeIn">
          <LuCheck className="h-5 w-5 shrink-0" />
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2 md:space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5">
          <FormInput
            id="firstName"
            label="First Name"
            type="text"
            placeholder="e.g. Alex"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <FormInput
            id="lastName"
            label="Last Name"
            type="text"
            placeholder="e.g. Rivera"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5">
          <FormInput
            id="email"
            label="Email Address"
            type="email"
            placeholder="alex@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <FormInput
            id="phoneNumber"
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5">
          <FormInput
            id="bio"
            label="Short Bio"
            placeholder="Tell us a bit about yourself"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div className="pt-2 flex justify-start">
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            disabled={isPending}
            className="w-full sm:w-auto font-semibold gap-2 shadow-md"
          >
            {isPending ? (
              <>
                <LuLoader className="h-5 w-5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <LuSave className="h-5 w-5" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
