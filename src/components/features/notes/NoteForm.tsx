'use client';

import { FormInput } from '@/components/common/FormInput';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CreateNoteInput, CreateNoteSchema } from '@/schema/notes';
import { cn } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { NoteEditorHeader } from './editor/NoteEditorHeader';
import { NoteEditorPreviewModal } from './editor/NoteEditorPreviewModal';
import { NoteEditorQuestions } from './editor/NoteEditorQuestions';
import { NoteEditorSettings } from './editor/NoteEditorSettings';

interface NoteFormProps {
  initialData?: Partial<CreateNoteInput>;
  onSubmit: (data: CreateNoteInput) => void;
  isSubmitting?: boolean;
}

export const NoteForm: React.FC<NoteFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateNoteInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateNoteSchema) as any,
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      technologies: initialData?.technologies || [],
      visibility: initialData?.visibility || 'PRIVATE',
      questions: initialData?.questions?.map((q, idx) => ({
        id: q.id || crypto.randomUUID(),
        question: q.question || '',
        answer: q.answer || {},
        order: q.order ?? idx,
      })) || [],
    },
    mode: 'onTouched',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const technologies = watch('technologies');
  const visibility = watch('visibility');
  const allFields = watch();

  const handleAddTechnology = (tech: string) => {
    setValue('technologies', [...technologies, tech], {
      shouldValidate: true,
    });
  };

  const handleRemoveTechnology = (tech: string) => {
    setValue(
      'technologies',
      technologies.filter((t) => t !== tech),
      { shouldValidate: true }
    );
  };

  const handleVisibilityChange = (val: 'PRIVATE' | 'PUBLIC') => {
    setValue('visibility', val, { shouldValidate: true });
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pb-12">
        {/* ─── Sticky Header Bar ─── */}
        <NoteEditorHeader
          isEditing={!!initialData}
          isSubmitting={isSubmitting}
          onPreview={() => setIsPreviewOpen(true)}
        />

        {/* ─── Main Content & Sidebar Grid (4 Columns for wider Q&A) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Main Left Columns: Basic Info & Q&As (Takes 75% width on desktop) */}
          <div className="lg:col-span-3 space-y-5">
            <div className="p-4 sm:p-6 border rounded-2xl bg-card/40 backdrop-blur-sm shadow-2xs space-y-4">
              <div className="border-b pb-2.5 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold tracking-tight text-foreground">
                    Basic Information
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Give your note a catchy title and summary.
                  </p>
                </div>
              </div>

              <FormInput
                id="title"
                label="Title"
                placeholder="e.g. Next.js 16 App Router Caching Strategies"
                error={errors.title?.message}
                className="bg-background/80 h-10 text-sm font-medium rounded-xl border-muted-foreground/20 focus:border-primary transition-all"
                {...register('title')}
              />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description" className="font-semibold text-xs">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[10px] text-muted-foreground">
                    Max 200 characters
                  </span>
                </div>
                <Textarea
                  id="description"
                  placeholder="Provide a concise summary of what this note covers..."
                  className={cn(
                    'min-h-[70px] bg-background/80 rounded-xl border-muted-foreground/20 focus:border-primary transition-all p-3 text-xs leading-relaxed',
                    errors.description &&
                      'border-destructive focus-visible:ring-destructive'
                  )}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-xs font-medium text-destructive mt-1 animate-in fade-in">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* Q&A Section */}
            <div className="p-4 sm:p-6 border rounded-2xl bg-card/40 backdrop-blur-sm shadow-2xs">
              <NoteEditorQuestions
                fields={fields}
                append={append}
                remove={remove}
                register={register}
                control={control}
                errors={errors}
                setValue={setValue}
              />
            </div>
          </div>

          {/* Right Column: Sticky Settings Sidebar (Takes 25% width on desktop) */}
          <div className="lg:col-span-1">
            <NoteEditorSettings
              visibility={visibility}
              onVisibilityChange={handleVisibilityChange}
              technologies={technologies}
              onAddTechnology={handleAddTechnology}
              onRemoveTechnology={handleRemoveTechnology}
              technologiesError={errors.technologies?.message}
            />
          </div>
        </div>
      </form>

      {/* ─── Preview Modal ─── */}
      <NoteEditorPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        formData={allFields}
      />
    </div>
  );
};
