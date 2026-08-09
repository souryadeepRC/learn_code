import { AppShell } from '@/components/common/AppShell';

/**
 * AppLayout
 *
 * Wraps all authenticated app screens (dashboard, notes, practice, profile,
 * technologies) in the persistent AppShell header/sidebar chrome. Auth pages
 * live outside this route group and intentionally render without chrome.
 */
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return <AppShell>{children}</AppShell>;
};

export default AppLayout;
