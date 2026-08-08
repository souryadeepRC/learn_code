'use client';

import { AppHeaderLogo } from '@/components/common/AppHeaderLogo';
import { AppHeaderUserActions } from '@/components/common/AppHeaderUserActions';
import { AppSidebar } from '@/components/common/AppSidebar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/root/src/utils';
import { useEffect, useState } from 'react';
import { RiMenuLine } from 'react-icons/ri';

type Props = {
  children: React.ReactNode;
};

/**
 * AppShell — persistent header + sidebar chrome mounted once at the root
 * layout so individual routes never need to render their own header/nav.
 *
 * - Header: hamburger (mobile only) + logo — theme toggle + avatar/CTA.
 * - Sidebar: fixed icon+label rail on lg+, icon-only rail on md–lg, and a
 *   left Sheet drawer (full labels) on mobile, triggered by the hamburger.
 */
export const AppShell = ({ children }: Props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <header
          className={cn(
            'sticky top-0 z-50 w-full',
            'border-b border-border/60',
            'bg-card/80 backdrop-blur-md',
            'transition-all duration-200',
            scrolled && 'shadow-sm shadow-foreground/5'
          )}
          role="banner"
        >
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation"
                aria-expanded={drawerOpen}
                aria-controls="mobile-nav"
                onClick={() => setDrawerOpen(true)}
              >
                <RiMenuLine className="h-5 w-5" aria-hidden="true" />
              </Button>
              <AppHeaderLogo />
            </div>

            <AppHeaderUserActions />
          </div>
        </header>

        <div className="flex flex-1">
          <aside className="hidden shrink-0 border-r border-sidebar-border bg-sidebar md:block md:w-16 lg:w-60">
            <AppSidebar variant="rail" />
          </aside>

          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetContent side="left" id="mobile-nav" className="w-64 bg-sidebar p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <AppSidebar
                variant="drawer"
                onNavigate={() => setDrawerOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
};
