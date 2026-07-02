'use client';

import { Badge } from '@/components/ui/badge';
import type { NavItem } from '@/config/headerNavConfig';
import { cn } from '@/root/src/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaGithub } from 'react-icons/fa';
import {
  RiBarChartLine,
  RiCodeBoxLine,
  RiDashboardLine,
  RiStackLine,
} from 'react-icons/ri';

const ICON_MAP: Record<string, React.ElementType> = {
  github: FaGithub,
  technologies: RiStackLine,
  scorecard: RiBarChartLine,
  dashboard: RiDashboardLine,
  practice: RiCodeBoxLine,
};

type Props = {
  item: NavItem;
  /** Call-back for closing the mobile menu after navigation. */
  onNavigate?: () => void;
  className?: string;
};

/**
 * AppHeaderNavLink — a single nav item rendered as an accessible Next.js Link.
 * Highlights itself when the current pathname starts with the item's href.
 * Optionally renders a badge pill (e.g. "New", "Pro").
 */
export const AppHeaderNavLink = ({ item, onNavigate, className }: Props) => {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  const IconComponent = item.icon ? ICON_MAP[item.icon] : null;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        // Base
        'flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg',
        'text-sm font-medium transition-all duration-200 outline-none',
        // Focus ring
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        // Inactive
        'text-foreground/80 hover:bg-primary/10',
        // Active
        isActive && 'text-active font-bold',
        className
      )}
    >
      {/* Optional badge */}
      {item.badge && (
        <Badge
          className={cn(
            'text-[10px] text-foreground bg-primary/15 border border-primary/25 font-semibold mr-1'
          )}
          variant="outline"
        >
          {item.badge}
        </Badge>
      )}

      {IconComponent && (
        <span className="shrink-0" aria-hidden="true">
          <IconComponent className="h-4 w-4" />
        </span>
      )}

      <span>{item.label}</span>

      {/* Active underline indicator */}
      {isActive && (
        <span
          className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary"
          aria-hidden="true"
        />
      )}
    </Link>
  );
};
