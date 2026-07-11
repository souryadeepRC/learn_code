'use client';

import { Button } from '@/components/ui/button';
import { CreateNoteInput } from '@/schema/notes';
import React from 'react';
import { Control, FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { FiLayers, FiPlus } from 'react-icons/fi';
import { NoteEditorQuestionCard } from './NoteEditorQuestionCard';

interface NoteEditorQuestionsProps {
  fields: Array<{ id: string }>;
  append: (val: { id: string; question: string; answer: Record<string, unknown>; order: number }) => void;
  remove: (index: number) => void;
  register: UseFormRegister<CreateNoteInput>;
  control: Control<CreateNoteInput>;
  errors: FieldErrors<CreateNoteInput>;
  setValue: UseFormSetValue<CreateNoteInput>;
}

export const NoteEditorQuestions: React.FC<NoteEditorQuestionsProps> = ({
  fields,
  append,
  remove,
  register,
  control,
  errors,
}) => {
  const handleAddQuestion = () => {
    append({
      id: crypto.randomUUID(),
      question: '',
      answer: {},
      order: fields.length,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <FiLayers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold tracking-tight text-foreground">
                Q&amp;A Blocks
              </h3>
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-secondary text-secondary-foreground">
                {fields.length}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Break down complex technical topics into specific questions and rich-text answers.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={handleAddQuestion}
          className="flex items-center gap-1.5 rounded-xl shadow-2xs hover:shadow transition-all font-medium self-start sm:self-auto h-8 text-xs px-3"
        >
          <FiPlus className="h-3.5 w-3.5" />
          <span>Add Q&amp;A Block</span>
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 px-4 border-2 border-dashed border-muted-foreground/20 rounded-xl bg-card/30 hover:bg-card/50 transition-colors flex flex-col items-center justify-center space-y-2.5">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-0.5">
            <FiLayers className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">No questions added yet</h4>
          <p className="text-xs text-muted-foreground max-w-md text-center leading-relaxed">
            Start structuring your knowledge by adding your first Question &amp; Answer block below.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddQuestion}
            className="mt-1 flex items-center gap-1.5 rounded-xl border-primary/20 hover:border-primary/50 text-primary h-8 text-xs"
          >
            <FiPlus className="h-3.5 w-3.5" />
            <span>Create First Q&amp;A</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <NoteEditorQuestionCard
              key={field.id}
              index={index}
              register={register}
              control={control}
              errors={errors}
              onRemove={() => remove(index)}
            />
          ))}

          {/* Full-width Add Button inspired by mockup <button class="btn-secondary" style="width: 100%;"> */}
          <div className="pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddQuestion}
              className="w-full border-dashed border-2 border-primary/30 hover:border-primary hover:bg-primary/5 text-primary transition-all duration-200 h-10 rounded-xl font-semibold text-xs gap-1.5 shadow-2xs"
            >
              <FiPlus className="w-3.5 h-3.5" />
              <span>+ Add Another Question</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
