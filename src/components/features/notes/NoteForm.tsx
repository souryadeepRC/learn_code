'use client';

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
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FaRegStickyNote, FaSave } from 'react-icons/fa';
import { FiGlobe, FiLock, FiPlus, FiTrash2 } from 'react-icons/fi';
import { MdPreview } from 'react-icons/md';
import { Separator } from '../../ui/separator';

interface NoteFormProps {
  initialData?: Partial<CreateNoteInput>;
  initialTechnology?: TechnologySummary | null;
  onSubmit: (data: CreateNoteInput) => void;
  isSubmitting?: boolean;
}
const formSection =
  'bg-foreground/5 rounded-3xl px-4 md:px-6 py-2 md:py-3 mb-1 md:mb-2';
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
  const title = watch('title');
  const technologyId = watch('technologyId');

  const isDisabled =
    isSubmitting ||
    Object.keys(errors).length > 0 ||
    !title.trim() ||
    !technologyId;

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
    // Only call onSubmit, do NOT submit the form
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
        answer: question.answer ?? '',
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
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col md:p-2 gap-2"
    >
      <input type="hidden" {...register('description')} />
      {/* ─── Header ─── */}
      <div
        className={`${formSection} flex md:flex-row  items-center justify-between 
      gap-4    
      `}
      >
        <Button variant="rounded" size="md" type="button">
          <MdPreview />
          <span className="hidden sm:inline">Preview</span>
        </Button>
        <Input
          id="title"
          placeholder="Add a title for your note..."
          required
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
          {...register('title')}
          className="font-bold"
          variant="underline"
        />

        <Button
          size="lg"
          type="button"
          className="rounded-xl h-10"
          disabled={isDisabled}
          onClick={handleSubmit(handleFormSubmit)}
        >
          <FaSave />
          <span className="hidden sm:inline">
            {isSubmitting ? 'Saving...' : 'Save'}
          </span>
        </Button>
      </div>
      {errors.title && (
        <p id="title-error" className="text-xs text-destructive">
          {errors.title.message}
        </p>
      )}

      <div className={`${formSection} grid grid-cols-2 md:grid-cols-3 gap-4`}>
        <div className="flex items-center gap-2  ">
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

      <div
        className={`${formSection} flex gap-1 md:gap-3 items-center justify-between`}
      >
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
          variant="rounded"
          onClick={handleAddQuestion}
          className="gap-2 whitespace-nowrap"
          size="md"
        >
          <FiPlus className="w-4 h-4" />
          Add
          <span className="hidden sm:inline"> Question</span>
        </Button>
      </div>

      <div className="pt-2 pb-4">
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
          <>
            {fields[activeQuestionIdx] && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-foreground/60">
                    Question {activeQuestionIdx + 1} of {fields.length}
                  </p>
                  <Button
                    type="button"
                    variant="destructiveOutline"
                    size="sm"
                    className="rounded-full px-4"
                    onClick={handleRemoveQuestion}
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                    <span className="hidden sm:inline"> Question</span>
                  </Button>
                </div>
                <Separator />
                <QuestionEditor
                  key={`${activeQuestionIdx}-${fields[activeQuestionIdx]?.id ?? 'new'}`}
                  index={activeQuestionIdx}
                  control={control}
                  register={register}
                  errors={errors}
                />
              </div>
            )}
          </>
        )}
      </div>
    </form>
  );
};
