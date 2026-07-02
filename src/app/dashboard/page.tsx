'use client';

import { AppHeader } from '@/components/common/AppHeader';
import { AuthGuard } from '@/components/common/AuthGuard';
import { Content } from '@/components/common/Content';
import { Heading } from '@/components/common/Heading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  selectAuthEmail,
  selectIsPremium,
  selectUserInitials,
} from '@/store/slices/authSelectors';
import {
  selectUserDisplayName,
  selectUserProfile,
  selectUserProfileInitials,
} from '@/store/slices/userSelectors';
import { useAppSelector } from '@/store/storeHooks';
import Link from 'next/link';
import {
  LuBookOpen,
  LuCalendar,
  LuMail,
  LuPhone,
  LuShieldCheck,
  LuTrophy,
  LuUser,
} from 'react-icons/lu';

const DashboardContent = () => {
  const profile = useAppSelector(selectUserProfile);
  const displayName = useAppSelector(selectUserDisplayName);
  const profileInitials = useAppSelector(selectUserProfileInitials);
  const authEmail = useAppSelector(selectAuthEmail);
  const emailInitials = useAppSelector(selectUserInitials);
  const isPremium = useAppSelector(selectIsPremium);

  const displayInitials = profileInitials || emailInitials || 'U';
  const displayEmail = profile?.email || authEmail || 'No email specified';

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* ── Header Section ── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 sm:p-8 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-5">
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-4 ring-primary/20">
            <AvatarImage
              src={profile?.imageUrl ?? ''}
              alt={displayName ?? 'User Avatar'}
            />
            <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
              {displayInitials}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Heading variant="h2" className="text-2xl sm:text-3xl font-bold">
                Welcome, {displayName || 'Developer'}!
              </Heading>
              <Badge
                variant={isPremium ? 'default' : 'secondary'}
                className="text-xs px-2.5 py-0.5"
              >
                {isPremium ? 'Pro Member' : 'Free Plan'}
              </Badge>
            </div>
            <Content size="sm" className="text-muted-foreground">
              Here is your secure account overview and learning progress.
            </Content>
          </div>
        </div>

        <Button
          asChild
          size="lg"
          className="shrink-0 self-start sm:self-center"
        >
          <Link href="/technologies">Explore Technologies</Link>
        </Button>
      </header>

      {/* ── Main Dashboard Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <LuUser className="h-5 w-5 text-primary" aria-hidden="true" />
              <CardTitle className="text-xl">
                User Profile Information
              </CardTitle>
            </div>
            <CardDescription>
              Your personal account details retrieved from our secure server
              session.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-1">
                <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <LuUser className="h-3.5 w-3.5" aria-hidden="true" />
                  Full Name
                </dt>
                <dd className="text-base font-medium text-foreground">
                  {displayName || 'Not specified'}
                </dd>
              </div>

              <div className="space-y-1">
                <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <LuMail className="h-3.5 w-3.5" aria-hidden="true" />
                  Email Address
                </dt>
                <dd className="text-base font-medium text-foreground">
                  {displayEmail}
                </dd>
              </div>

              <div className="space-y-1">
                <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <LuPhone className="h-3.5 w-3.5" aria-hidden="true" />
                  Phone Number
                </dt>
                <dd className="text-base font-medium text-foreground">
                  {profile?.phoneNumber || 'Not provided'}
                </dd>
              </div>

              <div className="space-y-1">
                <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <LuShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Account Status
                </dt>
                <dd className="text-base font-medium">
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600/30 bg-green-500/10 font-medium"
                  >
                    Active Session
                  </Badge>
                </dd>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Biography / About Me
                </dt>
                <dd className="text-sm text-foreground/90 bg-muted/50 p-3.5 rounded-lg border">
                  {profile?.bio || 'No biography written yet.'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Learning Progress Card */}
        <Card className="shadow-sm flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <LuTrophy className="h-5 w-5 text-amber-500" aria-hidden="true" />
              <CardTitle className="text-xl">Learning Progress</CardTitle>
            </div>
            <CardDescription>
              Your performance across MCQ challenges and coding problems.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-muted/40 border">
                <span className="text-sm font-medium flex items-center gap-2">
                  <LuBookOpen className="h-4 w-4 text-primary" />
                  MCQ Challenges
                </span>
                <Badge variant="secondary" className="font-mono">
                  0 Completed
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-lg bg-muted/40 border">
                <span className="text-sm font-medium flex items-center gap-2">
                  <LuTrophy className="h-4 w-4 text-amber-500" />
                  Coding Scorecard
                </span>
                <Badge variant="secondary" className="font-mono">
                  Beginner
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-lg bg-muted/40 border">
                <span className="text-sm font-medium flex items-center gap-2">
                  <LuCalendar className="h-4 w-4 text-green-500" />
                  Current Streak
                </span>
                <Badge variant="secondary" className="font-mono">
                  1 Day
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <AuthGuard requiredAccess="auth">
        <DashboardContent />
      </AuthGuard>
    </main>
  );
};

export default DashboardPage;
