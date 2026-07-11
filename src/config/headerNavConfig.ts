/** Supported icon identifiers mapped in AppSidebar. */
export type NavIconType =
  | 'github'
  | 'technologies'
  | 'scorecard'
  | 'dashboard'
  | 'practice'
  | 'notes';

/** Who is allowed to see a nav item. */
export type NavAccessLevel = 'public' | 'auth' | 'premium';

/** A single configurable navigation item. */
export type NavItem = {
  /** Unique stable key. */
  id: string;
  /** Display text rendered in the header. */
  label: string;
  /** Next.js href. */
  href: string;
  /** Access gate: public = everyone, auth = logged-in, premium = paid plan. */
  requiredAccess: NavAccessLevel;
  /** Optional icon identifier string mapped in client components. */
  icon?: NavIconType;
  /** Optional pill badge, e.g. "New" or "Pro". */
  badge?: string;
};

/**
 * Default application nav items.
 * Consumed by AppShell/AppSidebar to render navigation.
 *
 * To add a new link:
 *   { id: 'dashboard', label: 'Dashboard', href: '/dashboard', requiredAccess: 'auth', icon: 'dashboard' }
 */
export const NAV_ITEMS: NavItem[] = [
  {
    id: 'technologies',
    icon: 'technologies',
    label: 'Technologies',
    href: '/technologies',
    requiredAccess: 'public',
  },
  {
    id: 'notes',
    icon: 'notes',
    label: 'Notes',
    href: '/notes',
    requiredAccess: 'public',
  },
  {
    id: 'dashboard',
    icon: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    requiredAccess: 'auth',
  },
  {
    id: 'practice',
    icon: 'practice',
    label: 'Practice',
    href: '/practice',
    requiredAccess: 'premium',
    badge: 'Pro',
  },
];
