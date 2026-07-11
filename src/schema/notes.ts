import { z } from 'zod';

// ─── Q&A Pair ─────────────────────────────────────────────────────────────────

const QuillAnswerSchema = z.union([
  z.string(),
  z.record(z.string(), z.unknown()),
]);

export const QuestionAnswerSchema = z.object({
  id: z.string().min(1, 'Question ID required'), // crypto.randomUUID() on client
  question: z
    .string()
    .max(200, 'Title must be under 200 characters')
    .default(''),
  // Quill Delta JSON — { ops: [...] } — opaque at validation layer; editor owns shape
  answer: QuillAnswerSchema.optional().default({}),
  order: z.number().int().min(0).default(0),
});

// ─── Note ─────────────────────────────────────────────────────────────────────

export const CreateNoteSchema = z.object({
  // authorId is NOT accepted from client — injected from JWT at API layer
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be under 100 characters'),
  description: z
    .string()
    .max(200, 'Description must be at under 200 characters')
    .default(''),
  technologyId: z.string().min(1, 'Technology is required'),
  questions: z.array(QuestionAnswerSchema).default([]),
  // USER role always sends PRIVATE; ADMIN can send PUBLIC or PRIVATE
  visibility: z.enum(['PRIVATE', 'PUBLIC']).default('PRIVATE'),
  // USER role always gets FREE; ADMIN can specify tier but defaults to FREE
  requiredTier: z.enum(['FREE', 'S1', 'S2', 'S3']).default('FREE'),
});

export const UpdateNoteSchema = CreateNoteSchema.partial();

// ─── Archive Toggle ────────────────────────────────────────────────────────────

export const ArchiveNoteSchema = z.object({
  isArchived: z.boolean(),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type QuestionAnswerInput = z.infer<typeof QuestionAnswerSchema>;
export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;
export type ArchiveNoteInput = z.infer<typeof ArchiveNoteSchema>;
