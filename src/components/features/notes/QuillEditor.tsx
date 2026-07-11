'use client';

import { cn } from '@/utils';
import React, { useCallback, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import type ReactQuillType from 'react-quill-new';

interface QuillEditorProps {
  value: Record<string, unknown> | null;
  onChange: (value: Record<string, unknown>) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  readOnly?: boolean;
}

export const QuillEditor = React.forwardRef<ReactQuillType, QuillEditorProps>(
  (
    { value, onChange, placeholder, className, error, readOnly = false },
    ref
  ) => {
    const quillRef = useRef<ReactQuillType>(null);

    // Forward the ref
    React.useImperativeHandle(ref, () => quillRef.current as ReactQuillType);

    const handleChange = useCallback(
      (
        _content: string,
        _delta: unknown,
        source: string,
        editor: { getContents: () => unknown }
      ) => {
        if (source === 'user') {
          const contents = editor.getContents();
          // Convert Delta class instance to a plain object to satisfy Zod's record() validation
          const plainContents = JSON.parse(JSON.stringify(contents));
          onChange(plainContents as Record<string, unknown>);
        }
      },
      [onChange]
    );

    return (
      <div className={cn('relative w-full quill-editor-wrapper', className)}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          // We cast value to any because react-quill-new types expect string but it supports Delta objects natively
          value={(value as unknown as ReactQuillType.Value) || ''}
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
            !readOnly && '[&_.ql-editor]:min-h-[200px] [&_.ql-container]:min-h-[200px]',
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
  }
);

QuillEditor.displayName = 'QuillEditor';
