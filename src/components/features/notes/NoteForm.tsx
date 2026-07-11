'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { CreateNoteInput, CreateNoteSchema } from '@/schema/notes';
import type { TechnologySummary } from '@/types/technology';
import { cn } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  FiChevronUp,
  FiGlobe,
  FiLock,
  FiPlus,
  FiSave,
  FiTrash2,
} from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { TechnologyPicker } from './editor/TechnologyPicker';
import { QuestionEditor } from './editor/QuestionEditor';

interface NoteFormProps {
  initialData?: Partial<CreateNoteInput>;
  initialTechnology?: TechnologySummary | null;
  onSubmit: (data: CreateNoteInput) => void;
  isSubmitting?: boolean;
}

export const NoteForm: React.FC<NoteFormProps> = ({
  initialData,
  initialTechnology = null,
  onSubmit,
  isSubmitting = false,
}) => {
  const [technology, setTechnology] = useState<TechnologySummary | null>(
    initialTechnology
  );
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateNoteInput>({
    resolver: zodResolver(CreateNoteSchema) as unknown as any,
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      technologyId: initialData?.technologyId || '',
      visibility: (initialData?.visibility || 'PRIVATE') as 'PRIVATE' | 'PUBLIC',
      questions: (initialData?.questions?.map((q, idx) => ({
        id: q.id || crypto.randomUUID(),
        question: q.question || '',
        answer: q.answer || {},
        order: q.order ?? idx,
      })) || []) as any,
    },
    mode: 'onTouched',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const visibility = watch('visibility');
  const title = watch('title');
  const description = watch('description');

  const handleTechnologyChange = (next: TechnologySummary) => {
    setTechnology(next);
    setValue('technologyId', next.id, { shouldValidate: true });
  };

  const handleAddQuestion = () => {
    append({
      id: crypto.randomUUID(),
      question: '',
      answer: {},
      order: fields.length,
    });
    setActiveQuestionIdx(fields.length);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
      {/* ─── Header with Save Button ─── */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b px-4 sm:px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">
            {initialData ? 'Edit Note' : 'Create Note'}
          </h1>
          <p className="text-xs text-muted-foreground">
            {title || 'Add a title to get started'}
          </p>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="gap-2 rounded-lg"
        >
          <FiSave className="w-4 h-4" />
          <span>{isSubmitting ? 'Saving...' : 'Save Note'}</span>
        </Button>
      </div>

      {/* ─── Main Content Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-screen">
        {/* ─── Left: Main Editor (2/3 width) ─── */}
        <div className="lg:col-span-2 border-r space-y-6 p-4 sm:p-6 overflow-y-auto">
          {/* Title Input */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Note Title
            </Label>
            <Input
              placeholder="e.g. Next.js 16 Caching Strategies"
              className="h-12 text-lg font-semibold rounded-lg border-muted/50 focus:border-primary transition-all placeholder:text-muted-foreground/40"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </Label>
            <Textarea
              placeholder="Brief summary of what this note covers..."
              className={cn(
                'min-h-[100px] rounded-lg border-muted/50 focus:border-primary transition-all p-3 resize-none text-sm',
                errors.description && 'border-destructive'
              )}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* ─── Questions Section ─── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <h3 className="text-sm font-bold">Questions & Answers</h3>
                <p className="text-xs text-muted-foreground">
                  {fields.length} {fields.length === 1 ? 'question' : 'questions'}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddQuestion}
                className="gap-1.5 rounded-lg"
              >
                <FiPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Question</span>
              </Button>
            </div>

            {fields.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="text-4xl text-muted-foreground/30">📝</div>
                <p className="text-sm font-medium text-muted-foreground">
                  No questions yet
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Add your first question to structure your knowledge
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddQuestion}
                  className="gap-1.5 rounded-lg mx-auto mt-3"
                >
                  <FiPlus className="w-4 h-4" />
                  Add First Question
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Questions List - Vertical tabs */}
                <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                  {fields.map((field, idx) => (
                    <button
                      key={field.id}
                      type="button"
                      onClick={() => setActiveQuestionIdx(idx)}
                      className={cn(
                        'group flex items-center gap-3 p-3 rounded-lg border transition-all text-left',
                        activeQuestionIdx === idx
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-card/50 border-border hover:bg-card hover:border-primary/30'
                      )}
                    >
                      <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-background/50 text-xs font-semibold">
                        {idx + 1}
                      </span>
                      <span className="flex-1 truncate text-xs font-medium">
                        {watch(`questions.${idx}.question`) ||
                          'Untitled question'}
                      </span>
                      <FiChevronUp className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>

                {/* Active Question Editor */}
                {fields[activeQuestionIdx] && (
                  <div className="mt-6 pt-6 border-t space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold">
                        Question {activeQuestionIdx + 1} of {fields.length}
                      </h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          remove(activeQuestionIdx);
                          setActiveQuestionIdx(
                            Math.max(0, activeQuestionIdx - 1)
                          );
                        }}
                        className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        <span className="text-xs">Delete</span>
                      </Button>
                    </div>

                    <QuestionEditor
                      index={activeQuestionIdx}
                      control={control}
                      register={register}
                      errors={errors}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ─── Right: Settings Sidebar (1/3 width) ─── */}
        <div className="lg:col-span-1 bg-card/50 border-t lg:border-t-0 p-4 sm:p-6 space-y-6 overflow-y-auto">
          {/* Visibility Setting */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Visibility
            </Label>
            <div
              className="p-4 rounded-lg border-2 border-border cursor-pointer transition-all"
              onClick={() =>
                setValue(
                  'visibility',
                  visibility === 'PRIVATE' ? 'PUBLIC' : 'PRIVATE',
                  { shouldValidate: true }
                )
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'p-2 rounded-lg',
                      visibility === 'PUBLIC'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {visibility === 'PUBLIC' ? (
                      <FiGlobe className="w-5 h-5" />
                    ) : (
                      <FiLock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {visibility === 'PUBLIC' ? 'Public' : 'Private'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {visibility === 'PUBLIC'
                        ? 'Visible to everyone'
                        : 'Only you can see'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={visibility === 'PUBLIC'}
                  onCheckedChange={(checked) =>
                    setValue(
                      'visibility',
                      checked ? 'PUBLIC' : 'PRIVATE',
                      { shouldValidate: true }
                    )
                  }
                  className="h-6"
                />
              </div>
            </div>
          </div>

          {/* Technology Selection */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Technology
            </Label>
            <TechnologyPicker
              value={technology}
              onChange={handleTechnologyChange}
              error={errors.technologyId?.message}
            />
          </div>

          {/* Info Card */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
            <p className="text-xs font-semibold text-foreground">✨ Pro Tip</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Keep questions concise and focused. One concept per question helps
              with learning and retention.
            </p>
          </div>

          {/* Stats */}
          <div className="pt-4 border-t space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Title</span>
              <span className="font-semibold">{title.length}/100</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Description</span>
              <span className="font-semibold">{description.length}/500</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Questions</span>
              <span className="font-semibold">{fields.length}</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
