'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NoteQuestion, useUpdateNote } from '@/hooks/useNotes';
import React, { useState } from 'react';
import TipTapEditor from '../../../text-editor/TipTapEditor.tsx/TipTapEditor';

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
  const [answer, setAnswer] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const { mutate: updateNote, isPending } = useUpdateNote();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Please enter a question title.');
      return;
    }
    setError(null);

    const newQuestion: NoteQuestion = {
      id: crypto.randomUUID(),
      question: question.trim(),
      answer: answer,
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
          setAnswer('');
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
      <DialogContent className="min-w-[80vw] max-h-[85vh] overflow-y-auto p-6 rounded-2xl bg-card/95 backdrop-blur-xl shadow-xl">
        <DialogHeader className="  ">
          <DialogTitle className="text-xl text-primary font-bold tracking-tight   flex items-center gap-2">
            Add New Q&amp;A Block
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-1">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="question-title" className="text-xs font-semibold">
              Question<span className="text-destructive">*</span>
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
              <span>Answer</span>
            </Label>
            <div className="rounded-lg overflow-hidden border border-muted-foreground/20 bg-background/50 focus-within:border-primary transition-all">
              <TipTapEditor
                content={answer}
                onChange={setAnswer}
                placeholder="Provide a comprehensive explanation with code snippets, bullet points, or highlights..."
              />
            </div>
          </div>

          <DialogFooter className="  pt-2 gap-2 flex flex-row  justify-end items-center">
            <Button
              size="md"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className=" w-[20%] max-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="md"
              disabled={isPending || !question.trim()}
              className="   w-[40%] max-w-[200px]"
            >
              {isPending ? 'Adding...' : ' Submit Question'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
