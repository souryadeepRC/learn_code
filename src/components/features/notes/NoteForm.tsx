'use client';

import { FormInput } from '@/components/common/FormInput';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { CreateNoteInput, CreateNoteSchema } from '@/schema/notes';
import { cn } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import React, { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { FiAirplay, FiEye, FiPlus, FiTrash2 } from 'react-icons/fi';
import { QuillEditor } from './QuillEditor';

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
  const [techInput, setTechInput] = useState('');

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateNoteInput>({
    resolver: zodResolver(CreateNoteSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      technologies: initialData?.technologies || [],
      visibility: initialData?.visibility || 'PRIVATE',
      questions: initialData?.questions || [],
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

  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = techInput.trim();
      if (val && !technologies.includes(val)) {
        setValue('technologies', [...technologies, val], {
          shouldValidate: true,
        });
      }
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setValue(
      'technologies',
      technologies.filter((t) => t !== tech),
      { shouldValidate: true }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-16">
      {/* ─── Header & Actions ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {initialData ? 'Edit Note' : 'Create Note'}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Document your technical learnings with rich formatting.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <NotePreview formData={allFields} />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Saving...'
              : initialData
                ? 'Save Changes'
                : 'Publish Note'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ─── Main Content ─── */}
        <div className="md:col-span-2 space-y-6">
          <FormInput
            id="title"
            label="Title"
            placeholder="e.g. Next.js 14 App Router Caching"
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="space-y-2">
            <Label htmlFor="description" className="font-semibold text-sm">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Detailed explanation of the topic..."
              className={cn(
                'min-h-[120px] bg-background/80',
                errors.description &&
                  'border-destructive focus-visible:ring-destructive'
              )}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs font-medium text-destructive">
                {errors.description.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Minimum 200 characters required.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">
                  Q&A Blocks
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add specific questions and rich-text answers.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    id: crypto.randomUUID(),
                    question: '',
                    answer: {},
                    order: fields.length,
                  })
                }
              >
                <FiPlus className="h-4 w-4 mr-2" /> Add Q&A
              </Button>
            </div>

            {fields.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
                <p>No questions added yet.</p>
                <p className="text-sm mt-1">
                  Click &apos;Add Q&amp;A&apos; to start documenting specifics.
                </p>
              </div>
            )}

            <div className="space-y-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 sm:p-6 border rounded-lg bg-card shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300 relative group"
                >
                  <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-muted-foreground hover:text-destructive h-8 w-8"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-2 text-muted-foreground/50 cursor-move hidden sm:block">
                      <FiAirplay className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-5">
                      <FormInput
                        id={`questions.${index}.question`}
                        label={`Question ${index + 1}`}
                        placeholder="What is..."
                        error={errors.questions?.[index]?.question?.message}
                        {...register(`questions.${index}.question` as const)}
                      />

                      <div className="space-y-2">
                        <Label className="font-semibold text-sm">Answer</Label>
                        <Controller
                          control={control}
                          name={`questions.${index}.answer` as const}
                          render={({ field: { onChange, value } }) => (
                            <QuillEditor
                              value={value}
                              onChange={onChange}
                              placeholder="Rich text answer..."
                              error={errors.questions?.[index]?.answer?.message}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Sidebar Settings ─── */}
        <div className="space-y-6">
          <div className="p-5 border rounded-lg bg-card shadow-sm space-y-4">
            <h3 className="font-semibold">Note Settings</h3>

            <div className="space-y-2">
              <Label htmlFor="visibility" className="font-semibold text-sm">
                Visibility
              </Label>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-muted-foreground">
                  {visibility === 'PUBLIC'
                    ? 'Publicly visible'
                    : 'Private to you'}
                </span>
                <Switch
                  id="visibility"
                  checked={visibility === 'PUBLIC'}
                  onCheckedChange={(checked) =>
                    setValue('visibility', checked ? 'PUBLIC' : 'PRIVATE', {
                      shouldValidate: true,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Label htmlFor="tech" className="font-semibold text-sm">
                Technologies
              </Label>
              <Input
                id="tech"
                placeholder="Type and press Enter..."
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleAddTech}
                className="bg-background/80"
              />
              <div className="flex flex-wrap gap-2 pt-1">
                {technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                    onClick={() => handleRemoveTech(tech)}
                    title="Click to remove"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
              {errors.technologies && (
                <p className="text-xs text-destructive">
                  {errors.technologies.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

// ─── Preview Dialog ───

const NotePreview = ({ formData }: { formData: CreateNoteInput }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          <FiEye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Note Preview</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {formData.title || 'Untitled Note'}
            </h2>
            <div className="flex gap-2 mt-3 flex-wrap">
              {formData.technologies?.map((tech) => (
                <Badge key={tech} variant="default">
                  {tech}
                </Badge>
              ))}
              <Badge variant="outline">{formData.visibility}</Badge>
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {formData.description || 'No description provided.'}
            </p>
          </div>

          <div className="space-y-6 border-t pt-6">
            <h3 className="text-xl font-semibold">Q&A</h3>
            {formData.questions?.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No Q&A blocks added.
              </p>
            ) : (
              formData.questions?.map((q, idx) => {
                // Convert Delta to HTML
                let answerHtml = '';
                try {
                  const answerObj = q.answer as Record<string, unknown>;
                  if (answerObj && Array.isArray(answerObj.ops)) {
                    const converter = new QuillDeltaToHtmlConverter(
                      answerObj.ops,
                      {}
                    );
                    answerHtml = converter.convert();
                  }
                } catch (e) {
                  console.error('Delta conversion error:', e);
                }

                return (
                  <div key={q.id || idx} className="space-y-2">
                    <p className="font-semibold text-lg">
                      Q: {q.question || 'Untitled Question'}
                    </p>
                    {answerHtml ? (
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: answerHtml }}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No answer provided.
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
