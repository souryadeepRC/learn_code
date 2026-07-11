'use client';

import { Note } from '@/hooks/useNotes';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/root/src/components/ui/card';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import TipTapEditor from '../../text-editor/TipTapEditor.tsx/TipTapEditor';
import { Separator } from '../../ui/separator';

interface NoteQuestionsViewerProps {
  questions: Note['questions'];
}

export const NoteQuestionsViewer: React.FC<NoteQuestionsViewerProps> = ({
  questions,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const activeQuestion = questions[activeIndex];

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
        <TipTapEditor
          content={JSON.stringify(activeQuestion.answer)}
          editable={false}
        />
      </div>
    </div>
  );
};
