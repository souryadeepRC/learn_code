'use client';

import { Content } from '@/components/common/Content';
import { NoteForm } from '@/components/features/notes/NoteForm';
import { useCreateNote } from '@/hooks/useNotes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaAngleDoubleLeft } from 'react-icons/fa';

export default function CreateNotePage() {
  const router = useRouter();
  const { mutate: createNote, isPending } = useCreateNote();

  return (
    <Content>
      <div className="flex items-center justify-between gap-4 ">
        <Link
          className="flex text-primary text-xs gap-2 items-center"
          href="/notes"
        >
          <FaAngleDoubleLeft /> Back to All Notes
        </Link>
        <h1 className="text-primary text-lg md:text-xl lg:text-2xl font-bold">
          Create Note
        </h1>
      </div>
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
    </Content>
  );
}
