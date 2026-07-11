'use client';

import 'react-quill-new/dist/quill.snow.css';
import '@/styles/quill.css';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CreateNoteInput } from '@/schema/notes';
import { cn } from '@/utils';
import React, { useMemo } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from 'react-hook-form';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(
  () => import('react-quill-new').then((mod) => mod.default),
  { ssr: false, loading: () => <div className="h-48 bg-muted rounded-lg" /> }
);

interface QuestionEditorProps {
  index: number;
  control: Control<CreateNoteInput>;
  register: UseFormRegister<CreateNoteInput>;
  errors: FieldErrors<CreateNoteInput>;
}

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ header: [2, 3, false] }],
    ['link'],
    ['clean'],
  ],
};

const quillFormats = [
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'code-block',
  'list',
  'header',
  'link',
];

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  index,
  control,
  register,
  errors,
}) => {
  const questionError = errors.questions?.[index]?.question?.message;
  const answerError = errors.questions?.[index]?.answer?.message;

  const quillModulesMemo = useMemo(() => quillModules, []);
  const quillFormatsMemo = useMemo(() => quillFormats, []);

  return (
    <div className="space-y-4">
      {/* Question Input */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Question
        </Label>
        <Textarea
          placeholder="What is the main concept you want to ask about?"
          className={cn(
            'min-h-[80px] rounded-lg border-muted/50 focus:border-primary transition-all p-3 resize-none text-sm',
            questionError && 'border-destructive'
          )}
          {...register(`questions.${index}.question`)}
        />
        {questionError && typeof questionError === 'string' && (
          <p className="text-xs text-destructive">{questionError}</p>
        )}
      </div>

      {/* Answer Input with Rich Text */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Answer
          </Label>
          <span className="text-[10px] text-muted-foreground">
            Rich text editor
          </span>
        </div>

        <Controller
          name={`questions.${index}.answer`}
          control={control}
          render={({ field: { value, onChange } }) => {
            const quillValue = typeof value === 'string' ? value : '';
            return (
              <div className="rounded-lg border border-muted/50 overflow-hidden focus-within:border-primary transition-all">
                <ReactQuill
                  theme="snow"
                  value={quillValue}
                  onChange={onChange}
                  modules={quillModulesMemo}
                  formats={quillFormatsMemo}
                  placeholder="Type your answer here... You can format with bold, italic, links, code blocks, etc."
                  className="ql-editor-custom"
                />
              </div>
            );
          }}
        />
        {answerError && typeof answerError === 'string' && (
          <p className="text-xs text-destructive">{answerError}</p>
        )}
        <p className="text-xs text-muted-foreground leading-relaxed">
          💡 Use formatting to make your answer clear and scannable. Break down
          complex ideas into bullet points or code blocks.
        </p>
      </div>
    </div>
  );
};
