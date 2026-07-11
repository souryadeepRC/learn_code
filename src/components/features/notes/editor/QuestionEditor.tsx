'use client';

import '@/styles/quill.css';
import 'react-quill-new/dist/quill.snow.css';

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
import { QuillEditor } from '../QuillEditor';

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
          <Label className="text-xs font-semibold tracking-wider text-muted-foreground">
            Answer
          </Label>
        </div>

        <Controller
          name={`questions.${index}.answer`}
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className="rounded-lg border border-muted/50 overflow-hidden focus-within:border-primary transition-all">
              <QuillEditor
                value={value as string | Record<string, unknown> | null}
                onChange={onChange}
                placeholder="Type your answer here... You can format with bold, italic, links, code blocks, etc."
                className="ql-editor-custom"
                error={
                  typeof answerError === 'string' ? answerError : undefined
                }
              />
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
