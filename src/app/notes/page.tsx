'use client';

import { Content } from '@/components/common/Content';
import { Heading } from '@/components/common/Heading';
import { NotesList } from '@/components/features/notes/NotesList';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useDeleteNote,
  useToggleArchiveNote,
  useUserNotes,
} from '@/hooks/useNotes';
import Link from 'next/link';
import { useState } from 'react';
import { FiArchive, FiPlus } from 'react-icons/fi';

export default function NotesDashboard() {
  const [activeTab, setActiveTab] = useState('active');
  const { data: notes, isLoading } = useUserNotes(activeTab === 'archived');

  const { mutate: deleteNote } = useDeleteNote();
  const { mutate: toggleArchive } = useToggleArchiveNote();

  return (
    <Content className="max-w-7xl mx-auto space-y-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Heading as="h1">My Technical Notes</Heading>
          <p className="text-muted-foreground mt-2">
            Organize, search, and review your Q&A documentations.
          </p>
        </div>
        <Link href="/notes/create">
          <Button className="shadow-lg hover:shadow-xl transition-shadow">
            <FiPlus className="mr-2 h-4 w-4" /> Create Note
          </Button>
        </Link>
      </div>

      <Tabs
        defaultValue="active"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6 bg-muted/50 p-1">
          <TabsTrigger
            value="active"
            className="px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Active Notes
          </TabsTrigger>
          <TabsTrigger
            value="archived"
            className="px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <FiArchive className="w-3 h-3 mr-2" /> Archived
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-0 outline-none">
          <NotesList
            notes={notes || []}
            isLoading={isLoading}
            onDelete={(id) => {
              if (
                window.confirm('Are you sure you want to delete this note?')
              ) {
                deleteNote(id);
              }
            }}
            onArchive={(id, isArchived) =>
              toggleArchive({ id, data: { isArchived } })
            }
          />
        </TabsContent>

        <TabsContent value="archived" className="mt-0 outline-none">
          <NotesList
            notes={notes || []}
            isLoading={isLoading}
            onDelete={(id) => {
              if (
                window.confirm('Are you sure you want to delete this note?')
              ) {
                deleteNote(id);
              }
            }}
            onArchive={(id, isArchived) =>
              toggleArchive({ id, data: { isArchived } })
            }
          />
        </TabsContent>
      </Tabs>
    </Content>
  );
}
