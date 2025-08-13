import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import PageBreakComponent from '../components/Pagination/PageBreak';

export const PageBreak = Node.create({
    name: 'pageBreak',

    group: 'block',

    parseHTML() {
        return [
            {
                tag: 'div[data-type="page-break"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, {
            'data-type': 'page-break',
            'class': 'page-break-node',
            'style': 'page-break-before: always; break-before: page;'
        })];
    },

    addNodeView() {
        return ReactNodeViewRenderer(PageBreakComponent);
    },

    addCommands() {
        return {
            insertPageBreak: () => ({ commands }) => {
                return commands.insertContent({
                    type: this.name,
                });
            },
        };
    },

    addKeyboardShortcuts() {
        return {
            'Mod-Enter': () => this.editor.commands.insertPageBreak(),
        };
    },
});