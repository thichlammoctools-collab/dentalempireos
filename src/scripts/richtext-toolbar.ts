// Rich text toolbar — builds a DOM toolbar bound to a TipTap editor.
// Uses Material Symbols icons to match the rest of the admin UI.

import type { Editor } from '@tiptap/core';
import { pickAndUploadImage } from './richtext-editor';

export interface ToolbarOptions {
  editor: Editor;
}

interface ButtonDef {
  id: string;
  label: string;
  icon: string;
  title: string;
  group?: boolean;
}

const BUTTONS: (ButtonDef | 'sep')[] = [
  { id: 'h2', label: 'H2', icon: 'title', title: 'Tiêu đề 2' },
  { id: 'h3', label: 'H3', icon: 'subtitles', title: 'Tiêu đề 3' },
  { id: 'paragraph', label: 'P', icon: 'notes', title: 'Đoạn văn' },
  'sep',
  { id: 'bold', label: 'B', icon: 'format_bold', title: 'In đậm (Ctrl+B)' },
  { id: 'italic', label: 'I', icon: 'format_italic', title: 'In nghiêng (Ctrl+I)' },
  { id: 'underline', label: 'U', icon: 'format_underlined', title: 'Gạch chân (Ctrl+U)' },
  { id: 'strike', label: 'S', icon: 'format_strikethrough', title: 'Gạch ngang' },
  'sep',
  { id: 'bulletList', label: '•', icon: 'format_list_bulleted', title: 'Danh sách' },
  { id: 'orderedList', label: '1.', icon: 'format_list_numbered', title: 'Danh sách số' },
  'sep',
  { id: 'blockquote', label: '"', icon: 'format_quote', title: 'Trích dẫn' },
  { id: 'code', label: '</>', icon: 'code', title: 'Mã' },
  'sep',
  { id: 'link', label: '🔗', icon: 'link', title: 'Liên kết' },
  { id: 'unlink', label: '⛓', icon: 'link_off', title: 'Bỏ liên kết' },
  { id: 'image', label: '🖼', icon: 'image', title: 'Chèn ảnh' },
  'sep',
  { id: 'hr', label: '—', icon: 'horizontal_rule', title: 'Đường kẻ' },
  'sep',
  { id: 'align-left', label: '⬅', icon: 'format_align_left', title: 'Căn trái' },
  { id: 'align-center', label: '⬌', icon: 'format_align_center', title: 'Căn giữa' },
  { id: 'align-right', label: '➡', icon: 'format_align_right', title: 'Căn phải' },
];

function createButton(btn: ButtonDef, opts: ToolbarOptions): HTMLButtonElement {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'rich-tb-btn';
  el.title = btn.title;
  el.dataset.action = btn.id;
  el.innerHTML = `<span class="material-symbols-outlined" style="font-size:16px">${btn.icon}</span>`;
  el.addEventListener('click', (e) => {
    e.preventDefault();
    handleAction(btn.id, opts);
  });
  return el;
}

function handleAction(action: string, opts: ToolbarOptions): void {
  const { editor } = opts;
  const chain = editor.chain().focus();
  switch (action) {
    case 'h2': chain.toggleHeading({ level: 2 }).run(); break;
    case 'h3': chain.toggleHeading({ level: 3 }).run(); break;
    case 'paragraph': chain.setParagraph().run(); break;
    case 'bold': chain.toggleBold().run(); break;
    case 'italic': chain.toggleItalic().run(); break;
    case 'underline': chain.toggleUnderline().run(); break;
    case 'strike': chain.toggleStrike().run(); break;
    case 'bulletList': chain.toggleBulletList().run(); break;
    case 'orderedList': chain.toggleOrderedList().run(); break;
    case 'blockquote': chain.toggleBlockquote().run(); break;
    case 'code': chain.toggleCode().run(); break;
    case 'hr': chain.setHorizontalRule().run(); break;
    case 'align-left': chain.setTextAlign('left').run(); break;
    case 'align-center': chain.setTextAlign('center').run(); break;
    case 'align-right': chain.setTextAlign('right').run(); break;
    case 'link': {
      const prev = editor.getAttributes('link').href as string | undefined;
      const url = window.prompt('URL:', prev || 'https://');
      if (url === null) return;
      if (url === '') {
        chain.unsetLink().run();
      } else {
        chain.setLink({ href: url }).run();
      }
      break;
    }
    case 'unlink': chain.unsetLink().run(); break;
    case 'image': {
      pickAndUploadImage().then((result) => {
        if (result) {
          editor.chain().focus().setImage({ src: result.url, alt: result.alt }).run();
        }
      });
      break;
    }
  }
}

function updateActiveState(toolbar: HTMLElement, editor: Editor): void {
  const isActive = (name: string, attrs?: Record<string, unknown>): boolean => {
    try {
      return editor.isActive(name, attrs);
    } catch {
      return false;
    }
  };
  toolbar.querySelectorAll<HTMLButtonElement>('button[data-action]').forEach((btn) => {
    const action = btn.dataset.action;
    let active = false;
    switch (action) {
      case 'h2': active = isActive('heading', { level: 2 }); break;
      case 'h3': active = isActive('heading', { level: 3 }); break;
      case 'paragraph': active = isActive('paragraph'); break;
      case 'bold': active = isActive('bold'); break;
      case 'italic': active = isActive('italic'); break;
      case 'underline': active = isActive('underline'); break;
      case 'strike': active = isActive('strike'); break;
      case 'bulletList': active = isActive('bulletList'); break;
      case 'orderedList': active = isActive('orderedList'); break;
      case 'blockquote': active = isActive('blockquote'); break;
      case 'code': active = isActive('code'); break;
      case 'link': active = isActive('link'); break;
      case 'align-left': active = editor.isActive('paragraph', { textAlign: 'left' }); break;
      case 'align-center': active = editor.isActive('paragraph', { textAlign: 'center' }); break;
      case 'align-right': active = editor.isActive('paragraph', { textAlign: 'right' }); break;
    }
    btn.classList.toggle('is-active', active);
  });
}

export function renderRichTextToolbar(opts: ToolbarOptions): HTMLElement {
  const toolbar = document.createElement('div');
  toolbar.className = 'richtext-toolbar';

  for (const item of BUTTONS) {
    if (item === 'sep') {
      const sep = document.createElement('div');
      sep.className = 'rich-tb-sep';
      toolbar.appendChild(sep);
    } else {
      toolbar.appendChild(createButton(item, opts));
    }
  }

  const refresh = () => updateActiveState(toolbar, opts.editor);
  opts.editor.on('selectionUpdate', refresh);
  opts.editor.on('transaction', refresh);
  refresh();

  return toolbar;
}
