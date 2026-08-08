'use client';

import './style.css';

import { TextStyleKit } from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect, useRef } from 'react';

import { MenuBar } from './MenuBar';

const extensions = [TextStyleKit, StarterKit];

export interface TipTapEditorProps {
  /** Initial HTML content to populate the editor with. */
  content?: string;
  /** Called whenever the editor content changes. Receives the HTML string. */
  onChange?: (html: string) => void;
  /** Placeholder text shown when the editor is empty. */
  placeholder?: string;
  /** If true, the editor is read-only. */
  editable?: boolean;
  /** Additional CSS class for the wrapper. */
  className?: string;
  /** Maximum height of the editor (e.g., '400px', '50vh'). If omitted, no max-height CSS variable is applied. */
  maxHeight?: string;
}

const TipTapEditor = ({
  content = '',
  onChange,
  placeholder = 'Start writing...',
  editable = true,
  className = '',
  maxHeight,
}: TipTapEditorProps) => {
  // Track whether we're programmatically updating content to avoid infinite loops
  const isUpdatingRef = useRef(false);

  const handleUpdate = useCallback(
    ({
      editor,
    }: {
      editor: ReturnType<typeof useEditor> extends infer E
        ? NonNullable<E>
        : never;
    }) => {
      if (isUpdatingRef.current) return;
      onChange?.(editor.getHTML());
    },
    [onChange]
  );

  const editor = useEditor({
    extensions,
    content,
    editable,
    immediatelyRender: true,
    onUpdate: handleUpdate,
    editorProps: {
      attributes: {
        'data-placeholder': placeholder,
      },
    },
  });

  // Sync external content changes into the editor
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;

    const currentHTML = editor.getHTML();
    // Only update if the external content actually differs
    if (content !== currentHTML) {
      isUpdatingRef.current = true;
      editor.commands.setContent(content, { emitUpdate: false });
      isUpdatingRef.current = false;
    }
  }, [content, editor]);

  // Sync editable prop
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    editor.setEditable(editable);
  }, [editable, editor]);

  return (
    <div className={`editor-wrapper ${className}`.trim()}>
      {editable && <MenuBar editor={editor} />}
      <div
        className="editor-content"
        {...(maxHeight
          ? {
              style: {
                '--editor-max-height': maxHeight,
              } as React.CSSProperties,
            }
          : {})}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TipTapEditor;
