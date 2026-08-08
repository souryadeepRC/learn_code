import { Button } from '@/components/ui/button';
import { cn } from '@/utils';
import Link from 'next/link';
import React from 'react';
import { FiArchive, FiEdit2, FiSidebar, FiTrash2 } from 'react-icons/fi';

interface NoteActionBarProps {
  noteId: string;
  isArchived: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onToggleArchive: () => void;
  onDelete: () => void;
  activeIndex: number | null;
}

export const NoteActionBar: React.FC<NoteActionBarProps> = ({
  noteId,
  isArchived,
  isSidebarOpen,
  setIsSidebarOpen,
  onToggleArchive,
  onDelete,
  activeIndex,
}) => {
  return (
    <div
      className={cn(
        'sticky top-0 z-20 bg-card/95 backdrop-blur-md pt-2 pb-4 mb-6 flex-wrap justify-end md:justify-between items-center gap-4 border-b border-border/30 shrink-0',
        activeIndex !== null ? 'hidden md:flex' : 'flex'
      )}
    >
      <div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden md:flex text-muted-foreground hover:text-foreground"
          title="Toggle Sidebar"
        >
          <FiSidebar className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center p-1 bg-muted/30 rounded-lg border border-border/50 backdrop-blur-sm">
        <Link href={`/notes/${noteId}/edit`}>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-md hover:bg-background hover:shadow-sm"
          >
            <FiEdit2 className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground font-medium">Edit</span>
          </Button>
        </Link>

        <div className="w-px h-4 bg-border/50 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleArchive}
          className="h-8 rounded-md hover:bg-background hover:shadow-sm group"
          title={isArchived ? 'Unarchive Note' : 'Archive Note'}
        >
          <FiArchive className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-amber-500 transition-colors" />
          <span className="text-muted-foreground font-medium">
            {isArchived ? 'Unarchive' : 'Archive'}
          </span>
        </Button>

        <div className="w-px h-4 bg-border/50 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-8 rounded-md hover:bg-destructive/10 hover:text-destructive group"
          title="Delete Note"
        >
          <FiTrash2 className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
        </Button>
      </div>
    </div>
  );
};
