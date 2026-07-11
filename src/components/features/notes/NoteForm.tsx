'use client';
import { FaAngleDoubleLeft } from 'react-icons/fa';

import Button from '@/components/common/Button';
import EmptyBox from '@/components/common/EmptyBox';
import { QuestionEditor } from '@/components/features/notes/editor/QuestionEditor';
import { TechnologyPicker } from '@/components/features/notes/editor/TechnologyPicker';
import QuestionPagination from '@/components/features/notes/QuestionPagination';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { CreateNoteInput, CreateNoteSchema } from '@/schema/notes';
import type { TechnologySummary } from '@/types/technology';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FaRegStickyNote } from 'react-icons/fa';
import { FiGlobe, FiLock, FiPlus, FiSettings, FiTrash2 } from 'react-icons/fi';

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
  const [showSettings, setShowSettings] = useState(true);
  const toggleSettings = () => {
    setShowSettings((showSettings) => !showSettings);
  };
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateNoteInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateNoteSchema) as unknown as any,
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      technologyId: initialData?.technologyId || '',
      visibility: (initialData?.visibility || 'PRIVATE') as
        'PRIVATE' | 'PUBLIC',

      questions: (initialData?.questions?.map((q, idx) => ({
        id: q.id || crypto.randomUUID(),
        question: q.question || '',
        answer: q.answer || '',
        order: q.order ?? idx,
      })) || []) as any,
    },
    mode: 'onSubmit',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const visibility = watch('visibility');

  const handleTechnologyChange = (next: TechnologySummary) => {
    setTechnology(next);
    setValue('technologyId', next.id, { shouldValidate: true });
  };

  const handleAddQuestion = () => {
    const nextIndex = fields.length;

    append({
      id: crypto.randomUUID(),
      question: '',
      answer: '',
      order: nextIndex,
    });
    setActiveQuestionIdx(nextIndex);
  };

  const handleRemoveQuestion = () => {
    const nextIndex = Math.max(0, activeQuestionIdx - 1);

    remove(activeQuestionIdx);
    setActiveQuestionIdx(nextIndex);
  };

  const handleFormSubmit = (data: CreateNoteInput) => {
    const sanitizedQuestions = (data.questions ?? [])
      .filter((question) => {
        const text = question?.question?.trim() ?? '';
        const answer = question?.answer;

        if (text) return true;

        if (typeof answer === 'string') {
          return answer.trim().length > 0;
        }

        if (answer && typeof answer === 'object') {
          return Object.keys(answer).length > 0;
        }

        return false;
      })
      .map((question, index) => ({
        ...question,
        question: question.question?.trim() ?? '',
        answer: JSON.stringify({ content: question.answer ?? '' }),
        order: index,
      }));

    onSubmit({
      ...data,
      description: data.description?.trim() ?? '',
      questions: sanitizedQuestions,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col min-h-screen bg-background"
    >
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 px-4 py-3 border-b bg-background/95 backdrop-blur-sm">
        <div className="w-full md:w-[70%] flex flex-col md:flex-row items-start md:items-center  gap-1  px-4 py-0 md:py-3">
          <Link
            href="/notes"
            className="flex items-center text-primary hover:underline   pb-4 md:pb-0 "
          >
            <FaAngleDoubleLeft />
            <span className=" md:hidden pl-3">All Notes</span>
          </Link>
          <div className="flex-col">
            <input type="hidden" {...register('description')} />
            <Input
              id="title"
              placeholder="Add a title for your note..."
              required
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
              {...register('title')}
              className="text-md md:text-lgfont-semibold"
              variant="underline"
            />
            {errors.title && (
              <p id="title-error" className="text-sm text-destructive mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-row gap-2 justify-end py-2 px-4">
          <Button size="lg" type="submit" className="w-[50%]">
            Preview
          </Button>
          <Button
            size="lg"
            type="submit"
            className="w-[50%]"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'} Note
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-start gap-2 px-4 sm:px-6 py-3 bg-primary/10 border-b ">
        <Button
          type="button"
          variant="ghost"
          onClick={toggleSettings}
          leftIcon={<FiSettings className="w-4 h-4" />}
          title={showSettings ? 'Hide Settings' : 'Show Settings'}
        />
        {showSettings && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2  border-1 rounded-md">
              <Switch
                id="visibility"
                checked={visibility === 'PUBLIC'}
                onCheckedChange={(checked) =>
                  setValue('visibility', checked ? 'PUBLIC' : 'PRIVATE', {
                    shouldValidate: true,
                  })
                }
              />
              <label
                htmlFor="visibility"
                className="flex items-center gap-2 cursor-pointer text-sm font-medium"
              >
                {visibility === 'PUBLIC' ? (
                  <>
                    <FiGlobe className="w-4 h-4" />
                    Public
                  </>
                ) : (
                  <>
                    <FiLock className="w-4 h-4" />
                    Private
                  </>
                )}
              </label>
            </div>
            <TechnologyPicker
              value={technology}
              onChange={handleTechnologyChange}
              error={errors.technologyId?.message}
            />
          </div>
        )}
      </div>
      <div className="space-y-0">
        <div className="bg-primary/5 px-4 sm:px-6 py-4">
          <div className="flex gap-1 md:gap-3 items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge>{fields.length}&nbsp;Q&A</Badge>
            </div>

            <div className="flex flex-col gap-3   items-center  justify-end">
              {fields.length > 0 && (
                <QuestionPagination
                  activeQuestionIdx={activeQuestionIdx}
                  setActiveQuestionIdx={setActiveQuestionIdx}
                  fields={fields}
                />
              )}
            </div>

            <Button
              type="button"
              onClick={handleAddQuestion}
              className="gap-2 whitespace-nowrap"
              size="lg"
            >
              <FiPlus className="w-4 h-4" />
              Add
              <span className="hidden sm:inline"> Question</span>
            </Button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {fields.length === 0 ? (
            <EmptyBox
              Icon={FaRegStickyNote}
              title="No questions yet"
              description="Structure your learning notes"
              action={{
                onClick: handleAddQuestion,
                leftIcon: <FiPlus className="w-4 h-4" />,
                title: 'Add First Question',
              }}
            />
          ) : (
            <div className="space-y-6">
              {fields[activeQuestionIdx] && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-muted-foreground">
                      Question {activeQuestionIdx + 1} of {fields.length}
                    </p>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveQuestion}
                      className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Delete
                      <span className="hidden sm:inline"> Question</span>
                    </Button>
                  </div>

                  <QuestionEditor
                    key={`${activeQuestionIdx}-${fields[activeQuestionIdx]?.id ?? 'new'}`}
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
    </form>
  );
};
