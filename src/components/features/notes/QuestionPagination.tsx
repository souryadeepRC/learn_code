'use client';

import Button from '@/components/common/Button';
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Props {
  activeQuestionIdx: number;
  setActiveQuestionIdx: (idx: number) => void;
  fields: unknown[];
}

const QuestionPagination: React.FC<Props> = ({
  activeQuestionIdx,
  setActiveQuestionIdx,
  fields,
}) => {
  const totalQuestions = fields.length;
  const safeActiveQuestionIdx = Math.min(
    Math.max(activeQuestionIdx, 0),
    Math.max(totalQuestions - 1, 0)
  );

  const visibleIndexes =
    totalQuestions <= 3
      ? Array.from({ length: totalQuestions }, (_, index) => index)
      : (() => {
          if (safeActiveQuestionIdx <= 1) {
            return [0, 1, 2];
          }

          if (safeActiveQuestionIdx >= totalQuestions - 2) {
            return [totalQuestions - 3, totalQuestions - 2, totalQuestions - 1];
          }

          return [
            safeActiveQuestionIdx - 1,
            safeActiveQuestionIdx,
            safeActiveQuestionIdx + 1,
          ];
        })();

  if (totalQuestions === 0) {
    return null;
  }

  const showFirstButton = totalQuestions > 3 && safeActiveQuestionIdx >= 2;
  const showLastButton =
    totalQuestions > 3 && safeActiveQuestionIdx < totalQuestions - 2;

  return (
    <div className="flex items-center gap-2  overflow-x-auto">
      {showFirstButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveQuestionIdx(0)}
          aria-label="Go to first question"
        >
          <FiChevronLeft className="w-4 h-4" />
          <span className="hidden md:block">Go to </span>First
        </Button>
      )}

      <div className="flex gap-1 flex-1 overflow-x-auto">
        {visibleIndexes.map((index) => {
          const isActive = index === safeActiveQuestionIdx;

          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => setActiveQuestionIdx(index)}
              className={`  ${isActive ? 'font-bold' : ''}`}
            >
              Q{index + 1}
            </Button>
          );
        })}
      </div>

      {showLastButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveQuestionIdx(totalQuestions - 1)}
          aria-label="Go to last question"
        >
          <span className="hidden md:block">Go to </span>Last
          <FiChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default QuestionPagination;
