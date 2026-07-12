// TipTap rich text editor factory — vanilla JS, no React.
// Loaded via Vite bundling in Astro <script> blocks.

import { Editor, Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Highlight } from '@tiptap/extension-highlight';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { BubbleMenu } from '@tiptap/extension-bubble-menu';
import DOMPurify from 'isomorphic-dompurify';
import { createLowlight, all } from 'lowlight';
import { RICH_CONFIG } from '../lib/sanitize';
import { renderBubbleMenu, attachBubbleMenu } from './richtext-bubble-menu';
import { Callout } from './richtext-callout';

// ── Types ──────────────────────────────────────────────────

export interface RichTextOptions {
  element: HTMLElement;
  initialContent: string;
  onChange: (html: string) => void;
}

export interface RichTextHandle {
  editor: Editor;
  getHTML: () => string;
  destroy: () => void;
}

// ── Sanitize helper ────────────────────────────────────────

function sanitize(html: string): string {
  return DOMPurify.sanitize(html, RICH_CONFIG) as string;
}

// ── Keyboard shortcuts extension ───────────────────────────

const EditorShortcuts = Extension.create({
  name: 'editorShortcuts',
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-h': () => this.editor.chain().focus().toggleHighlight().run(),
      'Mod-Alt-1': () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
      'Mod-Alt-2': () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
      'Mod-Alt-3': () => this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
      'Mod-Alt-4': () => this.editor.chain().focus().toggleHeading({ level: 4 }).run(),
      'Mod-Alt-0': () => this.editor.chain().focus().setParagraph().run(),
    };
  },
});

// ── Lowlight setup ─────────────────────────────────────────

const lowlight = createLowlight(all);

// ── Factory ────────────────────────────────────────────────

export function createRichTextEditor(opts: RichTextOptions): RichTextHandle {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  // Create bubble element BEFORE editor so BubbleMenu can reference it
  const bubbleEl = renderBubbleMenu();

  const editor = new Editor({
    element: opts.element,
    content: opts.initialContent,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'rich-img' },
      }),
      Placeholder.configure({
        placeholder: 'Bắt đầu viết nội dung...',
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({ multicolor: false }),
      Subscript,
      Superscript,
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'plaintext',
        HTMLAttributes: { class: 'code-block' },
      }),
      BubbleMenu.configure({
        element: bubbleEl,
        tippyOptions: { duration: 150, placement: 'top' },
      }),
      Callout,
      EditorShortcuts,
    ],
    onUpdate: ({ editor: e }) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const raw = e.getHTML();
        opts.onChange(sanitize(raw));
      }, 250);
    },
  });

  // Attach bubble menu event handlers after editor is created
  attachBubbleMenu(editor, bubbleEl);

  return {
    editor,
    getHTML: () => sanitize(editor.getHTML()),
    destroy: () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      bubbleEl.remove();
      editor.destroy();
    },
  };
}

// ── Image upload helper ───────────────────────────────────

export function uploadImageFile(file: File): Promise<{ url: string; alt: string }> {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('purpose', 'blog');
    fetch('/api/admin/upload', { method: 'POST', body: fd })
      .then((res) => res.json() as Promise<{ url?: string }>)
      .then((data) => {
        if (data && data.url) {
          const alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
          resolve({ url: data.url, alt });
        } else {
          reject(new Error('Upload failed'));
        }
      })
      .catch(reject);
  });
}

export function pickAndUploadImage(): Promise<{ url: string; alt: string } | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) { resolve(null); return; }
      try {
        const result = await uploadImageFile(file);
        resolve(result);
      } catch {
        resolve(null);
      }
    };
    input.click();
  });
}
