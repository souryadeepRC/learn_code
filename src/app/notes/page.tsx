'use client';

import { Content } from '@/components/common/Content';
import PageHeader from '@/components/common/PageHeader';
import { SearchBox } from '@/components/common/SearchBox';
import { NotesGrid } from '@/components/features/notes/NotesGrid';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import Link from 'next/link';
import { useState } from 'react';
import { FiArchive, FiPlus } from 'react-icons/fi';

export default function NotesDashboard() {
  const [activeTab, setActiveTab] = useState('active');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 350);

  return (
    <Content>
      <PageHeader
        title="Technical Notes"
        description="Organize, search, and review your Q&A documentations"
      />

      <SearchBox
        value={search}
        onChange={setSearch}
        placeholder="Search notes by title or description…"
        aria-label="Search notes"
      />

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <Tabs
          defaultValue="active"
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList className="bg-muted/50 p-1">
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

        <Link href="/notes/create">
          <Button className="shadow-lg hover:shadow-xl transition-shadow">
            <FiPlus className="mr-2 h-4 w-4" /> Create Note
          </Button>
        </Link>
      </div>

      <NotesGrid
        includeArchived={activeTab === 'archived'}
        search={debouncedSearch}
      />
    </Content>
  );
}
