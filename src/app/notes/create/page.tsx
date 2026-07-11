'use client';

import { NoteForm } from '@/components/features/notes/NoteForm';
import { useCreateNote } from '@/hooks/useNotes';
import { useRouter } from 'next/navigation';

export default function CreateNotePage() {
  const router = useRouter();
  const { mutate: createNote, isPending } = useCreateNote();

  return (
    <NoteForm
      isSubmitting={isPending}
      onSubmit={(data) => {
        createNote(data, {
          onSuccess: () => {
            router.push('/notes');
          },
        });
      }}
    />
  );
}
