'use client';

import { Label } from '@/components/ui/label';
import { CreateNoteInput } from '@/schema/notes';
import React from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from 'react-hook-form';
import { FormInput } from '../../../common/FormInput';
import TipTapEditor from '../../../text-editor/TipTapEditor.tsx/TipTapEditor';

interface QuestionEditorProps {
  index: number;
  control: Control<CreateNoteInput>;
  register: UseFormRegister<CreateNoteInput>;
  errors: FieldErrors<CreateNoteInput>;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  index,
  control,
  register,
  errors,
}) => {
  const questionError = errors.questions?.[index]?.question?.message;
  const answerError = errors.questions?.[index]?.answer?.message;

  return (
    <div className="space-y-4">
      <FormInput
        id={`questions.${index}.question`}
        type="text"
        label="Question"
        placeholder="What is the main concept you want to ask about?"

        {...register(`questions.${index}.question`)}
        error={questionError}
      />

      {/* Answer Input with Rich Text */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold tracking-wider text-primary">
            Answer
          </Label>
        </div>

        <Controller
          name={`questions.${index}.answer`}
          control={control}
          render={({ field: { value, onChange } }) => (
            <div
              className="rounded-lg border border-muted/50 overflow-hidden 
             border-primary "
            >
              <TipTapEditor content={value} onChange={onChange} />
            </div>
          )}
        />
        {answerError && typeof answerError === 'string' && (
          <p className="text-xs text-destructive">{answerError}</p>
        )}
      </div>
    </div>
  );
};
