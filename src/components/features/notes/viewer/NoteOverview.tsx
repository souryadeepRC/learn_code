import { Badge } from '@/components/ui/badge';
import React from 'react';
import { FaLock } from 'react-icons/fa';
import { MdOutlinePublic } from 'react-icons/md';

interface NoteOverviewProps {
  title: string;
  description: string;
  visibility: string;
  isArchived: boolean;
  technologies: string[];
  formattedDate: string;
}

export const NoteOverview: React.FC<NoteOverviewProps> = ({
  title,
  description,
  visibility,
  isArchived,
  technologies,
  formattedDate,
}) => {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-primary leading-tight mb-6">
          {title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="default" className="shadow-sm">
            {visibility === 'PUBLIC' ? (
              <MdOutlinePublic className="mr-1.5" />
            ) : (
              <FaLock className="mr-1.5" />
            )}
            {visibility}
          </Badge>

          {isArchived && (
            <Badge variant="destructive" className="shadow-sm">
              Archived
            </Badge>
          )}

          <span className="flex items-center gap-2 bg-muted/40 px-3 py-1 rounded-full border border-border/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Updated {formattedDate}
          </span>
        </div>
      </div>

      {technologies && technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {technologies.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="px-3 py-1 text-sm bg-secondary/50 hover:bg-secondary/80 transition-colors cursor-default"
            >
              {tech}
            </Badge>
          ))}
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed text-muted-foreground pt-4 border-t border-border/30">
        <p>{description}</p>
      </div>
    </div>
  );
};
