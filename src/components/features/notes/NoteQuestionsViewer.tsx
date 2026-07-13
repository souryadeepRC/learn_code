'use client';

import { Note } from '@/hooks/useNotes';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/root/src/components/ui/card';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import EmptyBox from '../../common/EmptyBox';
import TipTapEditor from '../../text-editor/TipTapEditor.tsx/TipTapEditor';
import { AddQuestionDialog } from './viewer/AddQuestionDialog';

interface NoteQuestionsViewerProps {
  noteId: Note['id'];
  questions: Note['questions'];
}

export const NoteQuestionsViewer: React.FC<NoteQuestionsViewerProps> = ({
  noteId,
  questions,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow default Cmd+A / Ctrl+A text selection if typing inside inputs, textareas, or TipTapEditor
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAddDialogOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeQuestion = questions?.[activeIndex];
  const hasQuestions = questions.length > 0;
  const progressPercent = hasQuestions
    ? ((activeIndex + 1) / questions.length) * 100
    : 0;

  return (
    <>
      {!hasQuestions ? (
        <EmptyBox
          action={{
            variant: 'rounded',
            size: 'md',
            title: 'Add your First Question',
            onClick: () => setIsAddDialogOpen(true),
          }}
        />
      ) : (
        <div className="mt-1">
          <div className="flex justify-between">
            {hasQuestions && (
              <div className="py-2  flex gap-2 justify-center items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setActiveIndex((activeIndex) => activeIndex - 1)
                  }
                  disabled={activeIndex === 0}
                >
                  <FiChevronLeft />
                  Prev
                </Button>
                <p className="text-xs">
                  Question {activeIndex + 1} of {questions.length}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setActiveIndex((activeIndex) => activeIndex + 1)
                  }
                  disabled={activeIndex === questions.length - 1}
                >
                  Next <FiChevronRight />
                </Button>
              </div>
            )}
            <Button
              variant="rounded"
              size="md"
              className="px-6"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <span>Add a question</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-primary-foreground/20 text-primary-foreground rounded border border-primary-foreground/30 leading-none">
                <span className="text-xs">⌘</span>A
              </kbd>
            </Button>
          </div>
          <div className="h-1.5 w-full rounded-full bg-foreground/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {hasQuestions && (
            <div className="flex flex-col gap-4">
              <CardHeader>
                <CardTitle className="pt-2 text-sm font-bold">
                  Q{activeIndex + 1}. {activeQuestion.question}
                </CardTitle>
              </CardHeader>
              <TipTapEditor
                className="bg-red-100"
                content={activeQuestion.answer}
                editable={false}
                maxHeight="50vh"
              />
            </div>
          )}
        </div>
      )}
      <AddQuestionDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        noteId={noteId}
        existingQuestions={questions}
      />
    </>
  );
};
