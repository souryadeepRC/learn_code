import { AppHeader } from '@/components/common/AppHeader';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Notes | Skill Track AI',
  description: 'Manage, create, and view technical notes.',
};

/**
 * NotesLayout
 *
 * Wraps all notes pages (/notes, /notes/create, /notes/[id], etc.)
 * with the sticky AppHeader at the top level.
 */
const NotesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <AppHeader />
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
};

export default NotesLayout;
