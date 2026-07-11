'use client';

import { Badge } from '@/components/ui/badge';
import { NAV_ITEMS, type NavAccessLevel } from '@/config/headerNavConfig';
import { cn } from '@/root/src/utils';
import {
  selectIsAuthenticated,
  selectIsPremium,
} from '@/store/slices/authSelectors';
import { useAppSelector } from '@/store/storeHooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  RiBarChartLine,
  RiCodeBoxLine,
  RiDashboardLine,
  RiStackLine,
  RiStickyNoteLine,
} from 'react-icons/ri';

const ICON_MAP: Record<string, React.ElementType> = {
  technologies: RiStackLine,
  scorecard: RiBarChartLine,
  dashboard: RiDashboardLine,
  practice: RiCodeBoxLine,
  notes: RiStickyNoteLine,
};

const canAccess = (
  requiredAccess: NavAccessLevel,
  isAuthenticated: boolean,
  isPremium: boolean
): boolean => {
  if (requiredAccess === 'public') return true;
  if (requiredAccess === 'auth') return isAuthenticated;
  if (requiredAccess === 'premium') return isAuthenticated && isPremium;
  return false;
};

type Props = {
  /**
   * 'rail'   — fixed sidebar column: icon-only between md/lg, icon+label at lg+.
   * 'drawer' — mobile Sheet content: always icon+label.
   */
  variant?: 'rail' | 'drawer';
  /** Call-back for closing the mobile drawer after navigation. */
  onNavigate?: () => void;
  className?: string;
};

/**
 * AppSidebar — left navigation for the app shell.
 * Rendered as a fixed rail on tablet/desktop and inside a Sheet drawer on mobile.
 */
export const AppSidebar = ({
  variant = 'drawer',
  onNavigate,
  className,
}: Props) => {
  const pathname = usePathname();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isPremium = useAppSelector(selectIsPremium);
  const isRail = variant === 'rail';

  const visibleNavItems = NAV_ITEMS.filter((item) =>
    canAccess(item.requiredAccess, isAuthenticated, isPremium)
  );

  return (
    <div className={cn('flex h-full flex-col gap-1 p-2 lg:p-4', className)}>
      <nav aria-label="Main navigation" className="flex flex-col gap-1">
        {visibleNavItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon ? ICON_MAP[item.icon] : null;

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? 'page' : undefined}
              title={isRail ? item.label : undefined}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isActive && 'bg-sidebar-accent text-sidebar-accent-foreground',
                isRail && 'justify-center lg:justify-start'
              )}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
              <span className={cn('flex-1', isRail && 'hidden lg:inline')}>
                {item.label}
              </span>
              {item.badge && (
                <Badge
                  variant="outline"
                  className={cn(
                    'border-sidebar-primary/30 bg-sidebar-primary/10 text-[10px] text-sidebar-primary',
                    isRail && 'hidden lg:inline-flex'
                  )}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
