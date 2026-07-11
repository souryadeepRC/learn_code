'use client';

import { AuthGuard } from '@/components/common/AuthGuard';
import { Content } from '@/components/common/Content';
import { ProfileHeader } from '@/components/features/profile/ProfileHeader';
import { ProfileTabsView } from '@/components/features/profile/ProfileTabsView';
const ProfilePageContent = () => {
  return (
    <Content className="py-4 md:py-12 px-4 md:px-10 max-w-6xl mx-auto space-y-4 w-full min-w-0 max-w-full">
      <ProfileHeader />
      <ProfileTabsView />
    </Content>
  );
};

const ProfilePage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/20 flex flex-col">
      <AuthGuard requiredAccess="auth">
        <ProfilePageContent />
      </AuthGuard>
    </main>
  );
};

export default ProfilePage;
