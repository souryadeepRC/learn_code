import { Button } from '@/components/ui/button';
import { NoteQuestion } from '@/hooks/useNotes';
import { cn } from '@/utils';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import React, { useMemo } from 'react';
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
  const answerHtml = useMemo(() => {
    let html = '';
    try {
      const answerObj = question.answer as Record<string, unknown>;
      if (answerObj && Array.isArray(answerObj.ops)) {
        html = new QuillDeltaToHtmlConverter(answerObj.ops, {
          multiLineParagraph: false,
        }).convert();
      }
    } catch (e) {
      console.error(e);
    }
    return html;
  }, [question.answer]);

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
            <span className="text-muted-foreground/60">of</span> {totalQuestions}
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

        {answerHtml ? (
          <div
            className={cn(
              'prose prose-lg dark:prose-invert max-w-none',
              'prose-p:leading-relaxed prose-p:text-muted-foreground',
              'prose-headings:text-foreground prose-strong:text-foreground',
              'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
              'prose-ul:list-disc prose-ul:pl-6 prose-ul:text-muted-foreground prose-ul:marker:text-primary',
              'prose-ol:list-decimal prose-ol:pl-6 prose-ol:text-muted-foreground prose-ol:marker:text-primary',
              'prose-li:my-1',
              'prose-pre:bg-zinc-950 dark:prose-pre:bg-zinc-900 prose-pre:text-zinc-50 prose-pre:p-5 prose-pre:rounded-xl prose-pre:border prose-pre:border-zinc-800 prose-pre:shadow-md',
              'prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-medium',
              'prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground/80'
            )}
            dangerouslySetInnerHTML={{ __html: answerHtml }}
          />
        ) : (
          <p className="text-muted-foreground italic bg-muted/30 p-6 rounded-xl border border-dashed text-center">
            No answer provided for this question.
          </p>
        )}
      </div>
    </div>
  );
};
