'use client';

import { Note } from '@/hooks/useNotes';
import React, { useState } from 'react';
import { NoteActionBar } from './viewer/NoteActionBar';
import { NoteOverview } from './viewer/NoteOverview';
import { NoteQuestionDetail } from './viewer/NoteQuestionDetail';
import { NoteQuestionsSidebar } from './viewer/NoteQuestionsSidebar';

interface NoteQuestionsViewerProps {
  note: Note;
  onToggleArchive: () => void;
  onDelete: () => void;
}

export const NoteQuestionsViewer: React.FC<NoteQuestionsViewerProps> = ({
  note,
  onToggleArchive,
  onDelete,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const formattedDate = new Date(note.updatedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const questions = note.questions || [];

  return (
    <div className="flex flex-col-reverse md:flex-row h-full min-h-0 md:overflow-hidden overflow-y-auto w-full pr-1 md:pr-0">
      <NoteQuestionsSidebar
        questions={questions}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Right Main Content */}
      <div className="flex-1 flex flex-col min-w-0 md:overflow-hidden overflow-visible">
        <NoteActionBar
          noteId={note.id}
          isArchived={note.isArchived}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onToggleArchive={onToggleArchive}
          onDelete={onDelete}
          activeIndex={activeIndex}
        />

        {/* Content Area */}
        <div className="flex-1 md:overflow-y-auto md:pr-2 md:scrollbar-thin animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeIndex === null ? (
            <NoteOverview
              title={note.title}
              description={note.description}
              visibility={note.visibility}
              isArchived={note.isArchived}
              technologies={note.technologies}
              formattedDate={formattedDate}
            />
          ) : (
            <NoteQuestionDetail
              question={questions[activeIndex]}
              currentIndex={activeIndex}
              totalQuestions={questions.length}
              onPrev={() => activeIndex > 0 && setActiveIndex(activeIndex - 1)}
              onNext={() =>
                activeIndex < questions.length - 1 &&
                setActiveIndex(activeIndex + 1)
              }
              onBack={() => setActiveIndex(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
