import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Notes | Skill Track AI',
  description: 'Manage, create, and view technical notes.',
};

/**
 * NotesLayout — supplies page metadata for /notes, /notes/create, /notes/[id], etc.
 * The header/sidebar chrome comes from the root AppShell.
 */
const NotesLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-1 flex-col">{children}</div>;
};

export default NotesLayout;
