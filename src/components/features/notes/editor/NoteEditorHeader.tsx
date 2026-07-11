'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FiArrowLeft, FiEye, FiSave } from 'react-icons/fi';

interface NoteEditorHeaderProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onPreview: () => void;
  backUrl?: string;
}

export const NoteEditorHeader: React.FC<NoteEditorHeaderProps> = ({
  isEditing,
  isSubmitting,
  onPreview,
  backUrl = '/notes',
}) => {
  const router = useRouter();

  return (
    <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-md border-b py-2.5 mb-5 -mx-6 px-6 sm:-mx-10 sm:px-10 transition-all shadow-2xs">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push(backUrl)}
            className="text-muted-foreground hover:text-foreground -ml-2 gap-1 h-8 px-2 text-xs font-medium"
            title="Cancel & Go Back"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cancel</span>
          </Button>

          <div className="h-5 w-px bg-border/60 hidden sm:block" />

          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2 leading-none">
              <span>{isEditing ? 'Edit Note' : 'Create Note'}</span>
            </h1>
            <p className="text-muted-foreground mt-0.5 text-[11px] hidden md:block">
              Document technical learnings with rich formatting and Q&amp;As.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onPreview}
            className="flex items-center gap-1.5 hover:bg-secondary/80 transition-colors bg-background h-8 text-xs font-medium px-3"
          >
            <FiEye className="w-3.5 h-3.5 text-primary" />
            <span>Preview</span>
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 min-w-[110px] justify-center shadow-2xs hover:shadow transition-all bg-primary text-primary-foreground font-semibold h-8 text-xs px-3.5"
          >
            <FiSave className="w-3.5 h-3.5" />
            <span>
              {isSubmitting
                ? 'Saving...'
                : isEditing
                  ? 'Save Changes'
                  : 'Publish Note'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
