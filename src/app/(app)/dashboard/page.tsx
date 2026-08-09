'use client';

import { AuthGuard } from '@/components/common/AuthGuard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { selectAuthEmail, selectUserInitials } from '@/store/slices/authSelectors';
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
  LuShieldCheck,
  LuTrophy,
} from 'react-icons/lu';

type StatCard = {
  icon: React.ElementType;
  value: string;
  label: string;
};

const DashboardContent = () => {
  const profile = useAppSelector(selectUserProfile);
  const displayName = useAppSelector(selectUserDisplayName);
  const profileInitials = useAppSelector(selectUserProfileInitials);
  const authEmail = useAppSelector(selectAuthEmail);
  const emailInitials = useAppSelector(selectUserInitials);

  const displayInitials = profileInitials || emailInitials || 'U';
  const displayEmail = profile?.email || authEmail || 'No email specified';

  const stats: StatCard[] = [
    { icon: LuShieldCheck, value: 'Active', label: 'Account status' },
    { icon: LuBookOpen, value: '0', label: 'MCQ challenges completed' },
    { icon: LuTrophy, value: 'Beginner', label: 'Coding scorecard' },
    { icon: LuCalendar, value: '1 day', label: 'Current streak' },
  ];

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8">
      <h1 className="text-2xl font-semibold text-foreground">
        Welcome back, {displayName || 'there'}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Here&apos;s where your learning stands today.
      </p>

      {/* ── Stat cards ── */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="gap-2 p-4 shadow-sm">
            <stat.icon className="h-5 w-5 text-primary" aria-hidden="true" />
            <div className="text-2xl font-semibold text-foreground">
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* ── Continue learning ── */}
      <h2 className="mt-8 mb-3 text-sm font-semibold text-foreground">
        Continue learning
      </h2>
      <Card className="items-center gap-3 p-6 text-center shadow-sm sm:flex-row sm:text-left">
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            You haven&apos;t started a technology yet
          </p>
          <p className="text-xs text-muted-foreground">
            Browse the catalog and pick up where structured lessons and
            quizzes track your progress automatically.
          </p>
        </div>
        <Button asChild size="sm" className="shrink-0">
          <Link href="/technologies">Browse technologies</Link>
        </Button>
      </Card>

      {/* ── Profile summary ── */}
      <h2 className="mt-8 mb-3 text-sm font-semibold text-foreground">
        Your profile
      </h2>
      <Card className="gap-4 p-6 shadow-sm">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <div className="space-y-1">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Full name
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {displayName || 'Not specified'}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Email address
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {displayEmail}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Phone number
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {profile?.phoneNumber || 'Not provided'}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Initials
            </dt>
            <dd>
              <Badge variant="outline" className="font-mono">
                {displayInitials}
              </Badge>
            </dd>
          </div>
          {profile?.bio && (
            <div className="space-y-1 sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Biography
              </dt>
              <dd className="rounded-lg border border-border bg-muted/50 p-3 text-sm text-foreground/90">
                {profile.bio}
              </dd>
            </div>
          )}
        </dl>
      </Card>
    </div>
  );
};

const DashboardPage = () => {
  return (
    <AuthGuard requiredAccess="auth">
      <DashboardContent />
    </AuthGuard>
  );
};

export default DashboardPage;
