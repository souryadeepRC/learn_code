'use client';

import { Note } from '@/hooks/useNotes';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import React, { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardHeader,
  CardTitle,
} from '@/root/src/components/ui/card';
import { cn } from '@/root/src/utils';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Separator } from '../../ui/separator';

interface NoteQuestionsViewerProps {
  questions: Note['questions'];
}

export const NoteQuestionsViewer: React.FC<NoteQuestionsViewerProps> = ({
  questions,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const activeQuestion = questions[activeIndex];
  const answerHtml = useMemo(() => {
    if (!activeQuestion) return '';

    try {
      const answerValue = activeQuestion.answer as unknown;

      if (typeof answerValue === 'string' && answerValue.trim()) {
        return answerValue;
      }

      if (answerValue && typeof answerValue === 'object') {
        const answerObj = answerValue as Record<string, unknown>;

        if (Array.isArray(answerObj.ops)) {
          return new QuillDeltaToHtmlConverter(answerObj.ops, {
            multiLineParagraph: false,
          }).convert();
        }

        if (typeof answerObj.html === 'string' && answerObj.html.trim()) {
          return answerObj.html;
        }

        if (typeof answerObj.text === 'string' && answerObj.text.trim()) {
          return answerObj.text;
        }
      }
    } catch (e) {
      console.error(e);
    }

    return '';
  }, [activeQuestion]);
  return (
    <div>
      <div className="pb-2  flex gap-2 items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveIndex((activeIndex) => activeIndex - 1)}
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
          onClick={() => setActiveIndex((activeIndex) => activeIndex + 1)}
          disabled={activeIndex === questions.length - 1}
        >
          Next <FiChevronRight />
        </Button>
      </div>
      <Separator />
      <div>
        <CardHeader>
          <CardTitle className="pt-2 text-sm font-bold">
            Q{activeIndex + 1}. {activeQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {answerHtml ? (
            <div
              className={cn(
                'text-xs pt-2',
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
              dangerouslySetInnerHTML={{
                __html: answerHtml,
              }}
            />
          ) : (
            <p className="text-muted-foreground italic bg-muted/30 p-6 rounded-xl border border-dashed text-center">
              No answer provided for this question.
            </p>
          )}
        </CardContent>
      </div>
    </div>
  );
};
