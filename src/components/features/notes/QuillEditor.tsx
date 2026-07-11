'use client';

import { cn } from '@/utils';
import dynamic from 'next/dynamic';
import React, { useCallback } from 'react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(
  () => import('react-quill-new').then((mod) => mod.default),
  { ssr: false, loading: () => <div className="h-48 bg-muted rounded-lg" /> }
);

interface QuillEditorProps {
  value: Record<string, unknown> | string | null;
  onChange: (value: Record<string, unknown> | string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  readOnly?: boolean;
}

export const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  placeholder,
  className,
  error,
  readOnly = false,
}) => {
  const normalizedValue =
    typeof value === 'string'
      ? value
      : value && typeof value === 'object' && 'ops' in value
        ? value
        : '';

  const handleChange = useCallback(
    (
      _content: string,
      _delta: unknown,
      source: string,
      editor: { getContents: () => unknown }
    ) => {
      if (source === 'user') {
        const contents = editor.getContents();
        const plainContents = JSON.parse(JSON.stringify(contents));
        onChange(plainContents as Record<string, unknown>);
      }
    },
    [onChange]
  );

  return (
    <div className={cn('relative w-full quill-editor-wrapper', className)}>
      <ReactQuill
        theme="snow"
        value={normalizedValue as string}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={readOnly}
        modules={{
          toolbar: readOnly
            ? false
            : [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'code-block'],
                ['clean'],
              ],
        }}
        className={cn(
          'bg-background rounded-md border border-input shadow-sm focus-within:ring-1 focus-within:ring-primary',
          !readOnly &&
            '[&_.ql-editor]:min-h-[200px] [&_.ql-container]:min-h-[200px]',
          error && 'border-destructive focus-within:ring-destructive',
          readOnly &&
            'border-none shadow-none focus-within:ring-0 bg-transparent'
        )}
      />
      {error && (
        <p className="text-xs font-medium text-destructive mt-1.5">{error}</p>
      )}
    </div>
  );
};
