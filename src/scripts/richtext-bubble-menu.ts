// Bubble menu — floating toolbar xuất hiện khi bôi text.
// Rendered as a DOM element, attached via TipTap BubbleMenu extension.

import type { Editor } from '@tiptap/core';

export function renderBubbleMenu(editor: Editor): HTMLElement {
  const container = document.createElement('div');
  container.className = 'bubble-menu';

  const buttons = [
    { id: 'bold',      icon: 'format_bold',         title: 'In đậm (Ctrl+B)' },
    { id: 'italic',    icon: 'format_italic',        title: 'In nghiêng (Ctrl+I)' },
    { id: 'underline', icon: 'format_underlined',   title: 'Gạch chân (Ctrl+U)' },
    { id: 'strike',    icon: 'format_strikethrough', title: 'Gạch ngang' },
    { id: 'highlight', icon: 'highlight',            title: 'Tô đậm (Ctrl+Shift+H)' },
    { id: 'link',      icon: 'link',                title: 'Liên kết' },
    { id: 'code',      icon: 'code',                title: 'Mã inline' },
  ];

  for (const btn of buttons) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'bubble-btn';
    el.title = btn.title;
    el.dataset.action = btn.id;
    el.innerHTML = `<span class="material-symbols-outlined" style="font-size:16px">${btn.icon}</span>`;

    el.addEventListener('click', (e) => {
      e.preventDefault();
      const chain = editor.chain().focus();
      switch (btn.id) {
        case 'bold':      chain.toggleBold().run(); break;
        case 'italic':    chain.toggleItalic().run(); break;
        case 'underline': chain.toggleUnderline().run(); break;
        case 'strike':    chain.toggleStrike().run(); break;
        case 'highlight': chain.toggleHighlight().run(); break;
        case 'code':      chain.toggleCode().run(); break;
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
      }
    });

    container.appendChild(el);
  }

  const refresh = () => {
    const isActive = (name: string, attrs?: Record<string, unknown>) => {
      try { return editor.isActive(name, attrs); } catch { return false; }
    };
    container.querySelectorAll<HTMLButtonElement>('[data-action]').forEach((el) => {
      const action = el.dataset.action!;
      let active = false;
      switch (action) {
        case 'bold':      active = isActive('bold'); break;
        case 'italic':    active = isActive('italic'); break;
        case 'underline': active = isActive('underline'); break;
        case 'strike':    active = isActive('strike'); break;
        case 'highlight': active = isActive('highlight'); break;
        case 'code':      active = isActive('code'); break;
        case 'link':      active = isActive('link'); break;
      }
      el.classList.toggle('is-active', active);
    });
  };

  editor.on('selectionUpdate', refresh);
  editor.on('transaction', refresh);

  return container;
}
