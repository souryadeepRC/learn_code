import { Button } from '@/components/ui/button';
import { NoteQuestion } from '@/hooks/useNotes';
import { cn } from '@/utils';
import React from 'react';

interface NoteQuestionsSidebarProps {
  questions: NoteQuestion[];
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
  isSidebarOpen: boolean;
}

export const NoteQuestionsSidebar: React.FC<NoteQuestionsSidebarProps> = ({
  questions,
  activeIndex,
  setActiveIndex,
  isSidebarOpen,
}) => {
  return (
    <div
      className={cn(
        'transition-all duration-300 ease-in-out shrink-0',
        isSidebarOpen
          ? 'w-full md:w-64 lg:w-80 opacity-100 border-t md:border-t-0 md:border-r border-border/40 md:pr-4 md:mr-6 pt-6 md:pt-0 mt-2 md:mt-0'
          : 'w-0 opacity-0 overflow-hidden border-transparent md:pr-0 md:mr-0',
        activeIndex !== null ? 'hidden md:flex flex-col' : 'flex flex-col'
      )}
    >
      <div className="md:flex-1 md:overflow-y-auto md:pr-2 md:scrollbar-thin">
        <Button
          variant="ghost"
          className="hidden md:flex w-full justify-start mb-6 text-muted-foreground hover:text-foreground"
          onClick={() => setActiveIndex(null)}
        >
          Overview
        </Button>

        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Questions ({questions.length})
        </h3>

        {questions.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No Q&A documented.
          </p>
        ) : (
          <div className="space-y-2">
            {questions.map((q, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={q.id || idx}
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    'w-full text-left p-3 rounded-xl text-sm font-medium transition-all duration-200 border text-foreground/80 hover:text-foreground',
                    isActive
                      ? 'bg-primary/10 border-primary/30 text-primary shadow-sm'
                      : 'bg-transparent border-transparent hover:bg-muted/50'
                  )}
                >
                  <div className="flex gap-2 items-start">
                    <span
                      className={cn(
                        'opacity-70 mt-0.5',
                        isActive ? 'text-primary font-bold' : ''
                      )}
                    >
                      {idx + 1}.
                    </span>
                    <span className="line-clamp-2 leading-tight">
                      {q.question}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
