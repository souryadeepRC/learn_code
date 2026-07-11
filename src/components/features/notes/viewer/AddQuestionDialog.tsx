'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NoteQuestion, useUpdateNote } from '@/hooks/useNotes';
import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { QuillEditor } from '../QuillEditor';

interface AddQuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  noteId: string;
  existingQuestions: NoteQuestion[];
}

export const AddQuestionDialog: React.FC<AddQuestionDialogProps> = ({
  isOpen,
  onClose,
  noteId,
  existingQuestions,
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<Record<string, unknown> | string>({});
  const [error, setError] = useState<string | null>(null);

  const { mutate: updateNote, isPending } = useUpdateNote();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Please enter a question title.');
      return;
    }
    setError(null);

    const normalizedAnswer =
      typeof answer === 'string'
        ? answer.trim()
          ? answer
          : { ops: [{ insert: '\n' }] }
        : Object.keys(answer).length > 0
          ? answer
          : { ops: [{ insert: '\n' }] };

    const newQuestion: NoteQuestion = {
      id: crypto.randomUUID(),
      question: question.trim(),
      answer: normalizedAnswer as Record<string, unknown>,
      order: existingQuestions.length,
    };

    updateNote(
      {
        id: noteId,
        data: {
          questions: [...existingQuestions, newQuestion],
        },
      },
      {
        onSuccess: () => {
          setQuestion('');
          setAnswer({});
          onClose();
        },
        onError: (err: unknown) => {
          const errObj = err as { response?: { data?: { message?: string } } };
          setError(
            errObj?.response?.data?.message ||
              'Failed to add question. Please try again.'
          );
        },
      }
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(val) => !val && !isPending && onClose()}
    >
      <DialogContent className="min-w-[80vw] max-h-[85vh] overflow-y-auto p-6 rounded-2xl bg-card/95 backdrop-blur-xl border shadow-xl">
        <DialogHeader className="  ">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <FiPlus className="w-5 h-5" />
            </span>
            <span>Add New Q&amp;A Block</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Add a new question and rich-text answer directly to this note.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-1">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="question-title" className="text-xs font-semibold">
              Question Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="question-title"
              placeholder="e.g. How does server-side rendering work in Next.js?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isPending}
              className="h-10 text-sm rounded-lg bg-background/80"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center justify-between">
              <span>Detailed Answer</span>
              <span className="text-[10px] font-normal text-muted-foreground">
                Rich formatting enabled
              </span>
            </Label>
            <div className="rounded-lg overflow-hidden border border-muted-foreground/20 bg-background/50 focus-within:border-primary transition-all">
              <QuillEditor
                value={answer}
                onChange={setAnswer}
                placeholder="Provide a comprehensive explanation with code snippets, bullet points, or highlights..."
                className="[&_.ql-editor]:min-h-[420px] [&_.ql-container]:min-h-[420px] [&_.ql-editor]:text-sm"
              />
            </div>
          </div>

          <DialogFooter className=" pt-4 gap-2 flex flex-col sm:flex-row justify-end items-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isPending}
              className="w-full sm:w-auto h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending || !question.trim()}
              className="w-full sm:w-auto h-9 text-xs font-semibold gap-1.5 min-w-[120px]"
            >
              {isPending ? (
                <span>Adding...</span>
              ) : (
                <>
                  <FiPlus className="w-3.5 h-3.5" />
                  <span>Submit Question</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
