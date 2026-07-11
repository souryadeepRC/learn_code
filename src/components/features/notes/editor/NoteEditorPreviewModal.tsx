'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateNoteInput } from '@/schema/notes';
import type { TechnologySummary } from '@/types/technology';
import React from 'react';
import { FiBookOpen, FiGlobe, FiLock, FiTag } from 'react-icons/fi';

interface NoteEditorPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: CreateNoteInput;
  technology: TechnologySummary | null;
}

export const NoteEditorPreviewModal: React.FC<NoteEditorPreviewModalProps> = ({
  isOpen,
  onClose,
  formData,
  technology,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-4xl max-h-[88vh] overflow-y-auto p-6 sm:p-8 rounded-2xl border bg-card/95 backdrop-blur-xl shadow-xl">
        <DialogHeader className="border-b pb-4 mb-6">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <FiBookOpen className="w-4 h-4" />
            <span>Note Preview</span>
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            {formData.title || 'Untitled Note'}
          </DialogTitle>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Badge
              variant="outline"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg"
            >
              {formData.visibility === 'PUBLIC' ? (
                <FiGlobe className="w-3 h-3 text-primary" />
              ) : (
                <FiLock className="w-3 h-3 text-muted-foreground" />
              )}
              <span>{formData.visibility}</span>
            </Badge>
            {technology && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-secondary text-secondary-foreground"
              >
                <FiTag className="w-3 h-3 text-primary" />
                <span>{technology.name}</span>
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-8">
          {/* Note Description */}
          <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Overview &amp; Description
            </h4>
            <p className="text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-wrap font-normal">
              {formData.description || 'No description provided yet.'}
            </p>
          </div>

          {/* Q&A List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                Questions &amp; Answers ({formData.questions?.length || 0})
              </h3>
            </div>

            {!formData.questions || formData.questions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm italic">
                No Q&amp;A blocks added yet.
              </div>
            ) : (
              <div className="space-y-6">
                {formData.questions.map((q, idx) => {
                  return (
                    <div
                      key={q.id || idx}
                      className="p-6 rounded-2xl border bg-card shadow-xs space-y-4 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary shrink-0 mt-0.5">
                          #{idx + 1}
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                          {q.question || 'Untitled Question'}
                        </h4>
                      </div>

                      <div className="pl-0 sm:pl-11 pt-2 border-t sm:border-t-0 border-border/40">
                        {q.answer ? (
                          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                            {q.answer}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground/70 italic">
                            No detailed answer provided.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
