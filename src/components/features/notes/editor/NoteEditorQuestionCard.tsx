'use client';

import { FormInput } from '@/components/common/FormInput';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CreateNoteInput } from '@/schema/notes';
import React from 'react';
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { FiHelpCircle, FiMove, FiTrash2 } from 'react-icons/fi';
import { QuillEditor } from '../QuillEditor';

interface NoteEditorQuestionCardProps {
  index: number;
  register: UseFormRegister<CreateNoteInput>;
  control: Control<CreateNoteInput>;
  errors: FieldErrors<CreateNoteInput>;
  onRemove: () => void;
}

export const NoteEditorQuestionCard: React.FC<NoteEditorQuestionCardProps> = ({
  index,
  register,
  control,
  errors,
  onRemove,
}) => {
  const questionError = errors.questions?.[index]?.question?.message as
    | string
    | undefined;
  const answerError = errors.questions?.[index]?.answer?.message as
    | string
    | undefined;

  return (
    <div className="p-4 sm:p-5 border rounded-xl bg-card/70 backdrop-blur-sm shadow-2xs hover:shadow-sm transition-all duration-300 relative group border-muted-foreground/15 space-y-4">
      {/* Compact Card Header with integrated Remove Button */}
      <div className="flex items-center justify-between pb-2.5 border-b border-border/40 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-wide text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
            Q{index + 1}
          </span>
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hidden sm:inline">
            Question &amp; Answer Block
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="p-1 text-muted-foreground/40 hidden sm:block cursor-grab active:cursor-grabbing hover:text-muted-foreground transition-colors" title="Drag to reorder">
            <FiMove className="h-3.5 w-3.5" />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-destructive hover:bg-destructive/10 h-7 px-2 rounded-lg transition-all gap-1 text-[11px] font-medium"
            title="Remove Question"
          >
            <FiTrash2 className="h-3.5 w-3.5" />
            <span>Remove</span>
          </Button>
        </div>
      </div>

      {/* Card Inputs */}
      <div className="space-y-4">
        <div>
          <FormInput
            id={`questions.${index}.question`}
            label={`Question Title`}
            placeholder="e.g. What is the difference between useState and useReducer?"
            error={questionError}
            className="bg-background/80 h-9 text-sm font-medium rounded-lg border-muted-foreground/20 focus:border-primary transition-all"
            {...register(`questions.${index}.question` as const)}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="font-semibold text-xs flex items-center gap-1.5">
              <FiHelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Detailed Answer</span>
            </Label>
            <span className="text-[10px] text-muted-foreground">
              Rich formatting enabled
            </span>
          </div>
          
          <div className="rounded-lg overflow-hidden border border-muted-foreground/20 bg-background/50 focus-within:border-primary transition-all">
            <Controller
              control={control}
              name={`questions.${index}.answer` as const}
              render={({ field: { onChange, value } }) => (
                <QuillEditor
                  value={value}
                  onChange={onChange}
                  placeholder="Provide a comprehensive explanation with code snippets, bullet points, or highlights..."
                  error={answerError}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
