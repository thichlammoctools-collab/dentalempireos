// Custom Callout node cho TipTap — block dạng tip/warning/info/note.

import { Node, mergeAttributes } from '@tiptap/core';

export type CalloutType = 'tip' | 'warning' | 'info' | 'note';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      insertCallout: (type: CalloutType) => ReturnType;
    };
  }
}

export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'inline*',
  defining: true,

  addAttributes() {
    return {
      type: {
        default: 'tip' as CalloutType,
        parseHTML: (element) => element.getAttribute('data-callout-type') as CalloutType,
        renderHTML: (attributes) => ({ 'data-callout-type': attributes.type }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-callout-type]' }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const t = node.attrs.type as CalloutType;
    return ['div', mergeAttributes({ class: `callout callout-${t}` }, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      insertCallout: (type: CalloutType) => ({ chain }) => {
        return chain().insertContent({
          type: this.name,
          attrs: { type },
          content: [{ type: 'text', text: '' }],
        }).run();
      },
    };
  },
});
