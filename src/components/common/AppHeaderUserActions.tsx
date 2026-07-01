'use client';

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTE_CONFIG } from '@/config/routes.config';
import { useCurrentUser } from '@/hooks/use-current-user';
import apiClient from '@/lib/axios';
import { cn } from '@/root/src/utils';
import { clearCredentials } from '@/store/slices/auth-slice';
import {
  selectIsAuthenticated,
  selectUserInitials,
} from '@/store/slices/auth-selectors';
import {
  selectUserDisplayName,
  selectUserProfile,
  selectUserProfileInitials,
} from '@/store/slices/user-selectors';
import { clearUserProfile } from '@/store/slices/user-slice';
import { useAppDispatch, useAppSelector } from '@/store/store-hooks';
import Link from 'next/link';
import { LuLogOut, LuUser } from 'react-icons/lu';
import { ThemeToggle } from './ThemeToggle';

type Props = {
  /** When true, stacks items vertically (used inside the mobile Sheet). */
  vertical?: boolean;
};

/**
 * AppHeaderUserActions — right-side slot of the header.
 *
 * - Always: theme toggle button
 * - Guest: "JOIN US" CTA button
 * - Auth:  avatar circle with user profile image/initials & dropdown menu with logout
 */
export const AppHeaderUserActions = ({ vertical = false }: Props) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const emailInitials = useAppSelector(selectUserInitials);

  // Globally restore session & sync /api/user/me whenever header is active
  useCurrentUser();

  const profile = useAppSelector(selectUserProfile);
  const displayName = useAppSelector(selectUserDisplayName);
  const profileInitials = useAppSelector(selectUserProfileInitials);

  const displayInitials = profileInitials || emailInitials || 'U';

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors during logout
    } finally {
      dispatch(clearCredentials());
      dispatch(clearUserProfile());
      window.location.href = ROUTE_CONFIG.defaultGuestRoute;
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        vertical && 'flex-col items-stretch gap-3 pt-2'
      )}
    >
      {/* ── Theme toggle ─────────────────────────────────────────── */}

      <ThemeToggle />

      {/* ── Auth CTA / Avatar ────────────────────────────────────── */}
      {isAuthenticated ? (
        /* Avatar circle */
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                'bg-gradient-to-br from-primary to-secondary',
                'text-xs font-bold text-primary-foreground',
                'ring-2 ring-primary/30 ring-offset-2 ring-offset-background',
                'transition-all hover:ring-primary/60',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                vertical && 'h-10 w-10 self-start'
              )}
              aria-label="Your profile"
            >
              <Avatar>
                <AvatarImage
                  src={profile?.imageUrl ?? ''}
                  alt={displayName ?? 'User avatar'}
                />
                <AvatarFallback>{displayInitials}</AvatarFallback>
                <AvatarBadge className="bg-green-600 dark:bg-green-800" />
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {displayName || 'My Account'}
                </p>
                {profile?.email && (
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {profile.email}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard"
                  className="cursor-pointer flex items-center"
                >
                  <LuUser className="mr-2 h-4 w-4" aria-hidden="true" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive cursor-pointer flex items-center"
            >
              <LuLogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        /* JOIN US button */
        <Button
          variant="gradient"
          size={vertical ? 'lg' : 'sm'}
          asChild
          className={cn('gap-1.5', vertical && 'w-full justify-center')}
        >
          <Link href="/join">
            <span aria-hidden="true">✦</span>
            Join Us
          </Link>
        </Button>
      )}
    </div>
  );
};
