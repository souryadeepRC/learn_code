import { Button } from '@/components/ui/button';
import { NoteQuestion } from '@/hooks/useNotes';
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface NoteQuestionDetailProps {
  question: NoteQuestion;
  currentIndex: number;
  totalQuestions: number;
  onPrev: () => void;
  onNext: () => void;
  onBack: () => void;
}

export const NoteQuestionDetail: React.FC<NoteQuestionDetailProps> = ({
  question,
  currentIndex,
  totalQuestions,
  onPrev,
  onNext,
  onBack,
}) => {
  return (
    <div className="pb-10 relative">
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-md pb-4 pt-2 mb-8 flex items-center justify-between border-b border-border/30">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden -ml-2 text-muted-foreground hover:text-foreground"
            onClick={onBack}
          >
            <FiChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <span className="text-sm font-bold text-primary uppercase tracking-wider hidden md:inline-block">
            Question {currentIndex + 1}{' '}
            <span className="text-muted-foreground/60">of</span>{' '}
            {totalQuestions}
          </span>
          <span className="text-sm font-bold text-primary uppercase tracking-wider md:hidden">
            {currentIndex + 1}{' '}
            <span className="text-muted-foreground/60">/</span> {totalQuestions}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 hover:text-primary hover:border-primary/50"
            onClick={onPrev}
            disabled={currentIndex === 0}
          >
            <FiChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 hover:text-primary hover:border-primary/50"
            onClick={onNext}
            disabled={currentIndex === totalQuestions - 1}
          >
            <FiChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-8 leading-snug">
          {question.question}
        </h2>

        {question.answer ? (
          <div>{question.answer}</div>
        ) : (
          <p className="text-muted-foreground italic bg-muted/30 p-6 rounded-xl border border-dashed text-center">
            No answer provided for this question.
          </p>
        )}
      </div>
    </div>
  );
};
