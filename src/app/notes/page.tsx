'use client';

import { Content } from '@/components/common/Content';
import { NotesList } from '@/components/features/notes/NotesList';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useDeleteNote,
  useToggleArchiveNote,
  useUserNotes,
} from '@/hooks/useNotes';
import Link from 'next/link';
import { useState } from 'react';
import { FiArchive, FiPlus } from 'react-icons/fi';
import { GrNotes } from 'react-icons/gr';
import { ProfileCardHeader } from '../../components/features/profile/ProfileCardHeader';
export default function NotesDashboard() {
  const [activeTab, setActiveTab] = useState('active');
  const { data: notes, isLoading } = useUserNotes(activeTab === 'archived');

  const { mutate: deleteNote } = useDeleteNote();
  const { mutate: toggleArchive } = useToggleArchiveNote();

  return (
    <Content className="py-4 md:py-12 px-4 md:px-10 max-w-6xl mx-auto space-y-4 w-full min-w-0 max-w-full">
      <ProfileCardHeader
        icon={<GrNotes />}
        title="Technical Notes"
        description="Organize, search, and review your Q&A documentations"
      />

      <div className="flex flex-col md:flex-row   gap-2">
        <Link href="/notes/create">
          <Button className="shadow-lg hover:shadow-xl transition-shadow">
            <FiPlus className="mr-2 h-4 w-4" /> Create Note
          </Button>
        </Link>
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
        </Tabs>
      </div>
      <NotesList
        notes={notes || []}
        isLoading={isLoading}
        onDelete={(id) => {
          if (window.confirm('Are you sure you want to delete this note?')) {
            deleteNote(id);
          }
        }}
        onArchive={(id, isArchived) =>
          toggleArchive({ id, data: { isArchived } })
        }
      />
    </Content>
  );
}
