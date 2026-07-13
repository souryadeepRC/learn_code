'use client';

import { Content } from '@/components/common/Content';
import PageHeader from '@/components/common/PageHeader';
import { SearchBox } from '@/components/common/SearchBox';
import { NotesGrid } from '@/components/features/notes/NotesGrid';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';

export default function NotesDashboard() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 350);

  return (
    <Content>
      <PageHeader
        title="Technical Notes"
        description="Organize and review your Q&A documentations"
        actionCta={{
          title: 'Create Note',
          leftIcon: <FiPlus />,
          size: 'md',
          variant: 'rounded',
          onClick: () => router.push('/notes/create'),
          className: 'h-10 md:h-12 md:px-10',
        }}
      />

      <SearchBox
        value={search}
        onChange={setSearch}
        placeholder="Search notes by title or description"
        aria-label="Search notes"
      />

      <NotesGrid search={debouncedSearch} />
    </Content>
  );
}
