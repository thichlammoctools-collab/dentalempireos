// TipTap rich text editor factory — vanilla JS, no React.
// Loaded via Vite bundling in Astro <script> blocks.

import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import DOMPurify from 'isomorphic-dompurify';
import { RICH_CONFIG } from '../lib/sanitize';

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

// ── Factory ────────────────────────────────────────────────

export function createRichTextEditor(opts: RichTextOptions): RichTextHandle {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const editor = new Editor({
    element: opts.element,
    content: opts.initialContent,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
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
    ],
    onUpdate: ({ editor: e }) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const raw = e.getHTML();
        opts.onChange(sanitize(raw));
      }, 250);
    },
    onSelectionUpdate: () => {
      // Toolbar updates are handled by the toolbar's own listener
    },
  });

  // Prevent the parent block-wrapper's draggable from hijacking text selection
  // inside the editor. Without this, clicking/dragging on text starts a block-drag.
  const pmView = editor.view;
  if (pmView && pmView.dom) {
    pmView.dom.setAttribute('draggable', 'false');
    pmView.dom.addEventListener('dragstart', (e: Event) => {
      e.stopPropagation();
      (e as DragEvent).stopImmediatePropagation();
    });
  }

  return {
    editor,
    getHTML: () => sanitize(editor.getHTML()),
    destroy: () => {
      if (debounceTimer) clearTimeout(debounceTimer);
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
