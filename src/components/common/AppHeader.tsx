'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  NAV_ITEMS,
  type NavAccessLevel,
  type NavItem,
} from '@/config/header-nav.config';
import { cn } from '@/root/src/utils';
import {
  selectIsAuthenticated,
  selectIsPremium,
} from '@/store/slices/auth-selectors';
import { useAppSelector } from '@/store/store-hooks';
import { useCallback, useEffect, useState } from 'react';
import { RiCloseLine, RiMenuLine } from 'react-icons/ri';
import { AppHeaderLogo } from './AppHeaderLogo';
import { AppHeaderNavLink } from './AppHeaderNavLink';
import { AppHeaderUserActions } from './AppHeaderUserActions';

// ── Access gate helper ─────────────────────────────────────────────────────

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

// ── Component props ────────────────────────────────────────────────────────

type Props = {
  /** Optional override for nav items. Defaults to NAV_ITEMS from config. */
  navItems?: NavItem[];
  className?: string;
};

/**
 * AppHeader — sticky, responsive application header.
 *
 * - Desktop: Logo | Nav links | ThemeToggle + Auth CTA
 * - Mobile:  Logo | Hamburger → Sheet drawer with nav + actions
 *
 * Nav links are filtered at render time by the user's current access level
 * (public / auth / premium) using Redux auth state.
 *
 * Usage:
 * ```tsx
 * import { AppHeader } from '@/components/common/app-header';
 *
 * <AppHeader />
 * ```
 */
export const AppHeader = ({ navItems = NAV_ITEMS, className }: Props) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isPremium = useAppSelector(selectIsPremium);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for elevated header shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Filter nav items based on current user access level
  const visibleNavItems = navItems.filter((item) =>
    canAccess(item.requiredAccess, isAuthenticated, isPremium)
  );

  return (
    <TooltipProvider>
      <header
        className={cn(
          'sticky top-0 z-50 w-full',
          'border-b border-border/60',
          'bg-card/80 backdrop-blur-md',
          'transition-all duration-200',
          scrolled && 'shadow-sm shadow-foreground/5',
          className
        )}
        role="banner"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* ── Left: Mobile menu trigger (extreme left on mobile) + Logo ── */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex md:hidden items-center">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileOpen}
                    aria-controls="mobile-nav"
                  >
                    {mobileOpen ? (
                      <RiCloseLine className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <RiMenuLine className="h-5 w-5" aria-hidden="true" />
                    )}
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="left"
                  id="mobile-nav"
                  className={cn(
                    'w-[min(320px,90vw)] p-0',
                    'bg-card/95 backdrop-blur-xl',
                    'flex flex-col'
                  )}
                >
                  {/* Sheet header */}
                  <SheetHeader className="px-5 pt-5 pb-0">
                    <SheetTitle asChild>
                      <AppHeaderLogo />
                    </SheetTitle>
                  </SheetHeader>

                  <Separator />

                  {/* Mobile nav links */}
                  <nav
                    aria-label="Mobile navigation"
                    className="flex flex-col gap-1 px-3 py-0 flex-1"
                  >
                    {visibleNavItems.length === 0 ? (
                      <p className="px-3 pt-4 text-sm font-semibold text-foreground">
                        No navigation items available
                      </p>
                    ) : (
                      visibleNavItems.map((item) => (
                        <AppHeaderNavLink
                          key={item.id}
                          item={item}
                          onNavigate={closeMobile}
                          className="py-3 text-base"
                        />
                      ))
                    )}
                  </nav>

                  <Separator />
                </SheetContent>
              </Sheet>
            </div>

            <AppHeaderLogo />
          </div>

          {/* ── Desktop nav (Center) ─────────────────────────────── */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-4"
          >
            {visibleNavItems.map((item) => (
              <AppHeaderNavLink key={item.id} item={item} />
            ))}
          </nav>

          {/* ── User actions (Extreme Right on both Desktop & Mobile) ── */}
          <div className="flex items-center gap-2">
            <AppHeaderUserActions />
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};
