'use client';

import { Content } from '@/components/common/Content';
import { NoteForm } from '@/components/features/notes/NoteForm';
import { Button } from '@/components/ui/button';
import { useCreateNote } from '@/hooks/useNotes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';

export default function CreateNotePage() {
  const router = useRouter();
  const { mutate: createNote, isPending } = useCreateNote();

  return (
    <Content className="max-w-5xl mx-auto py-8">
      <div className="mb-6">
        <Link href="/notes">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 text-muted-foreground hover:text-foreground"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Notes
          </Button>
        </Link>
      </div>

      <div className="bg-card/30 backdrop-blur-sm border rounded-2xl p-6 sm:p-10 shadow-sm">
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
      </div>
    </Content>
  );
}
