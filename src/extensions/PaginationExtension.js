import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

const PaginationPluginKey = new PluginKey('pagination');

export const Pagination = Extension.create({
    name: 'pagination',

    addOptions() {
        return {
            pageHeight: 1056, // A4 height at 96 DPI
            pageMargin: 96,
            onPageChange: () => { },
        };
    },

    addProseMirrorPlugins() {
        const { pageHeight, onPageChange } = this.options;

        function calculateTotalPages(doc) {
            const estimatedHeight = doc.content.size * 20; // rough estimate
            return Math.max(1, Math.ceil(estimatedHeight / pageHeight));
        }

        return [
            new Plugin({
                key: PaginationPluginKey,

                state: {
                    init() {
                        return {
                            currentPage: 1,
                            totalPages: 1,
                            pageBreaks: [],
                        };
                    },

                    apply(tr, oldState) {
                        const newState = { ...oldState };

                        if (tr.docChanged) {
                            newState.totalPages = calculateTotalPages(tr.doc);
                        }

                        return newState;
                    },
                },

                view(editorView) {
                    return {
                        update(view) {
                            const state = PaginationPluginKey.getState(view.state);
                            if (typeof onPageChange === 'function') {
                                onPageChange(state);
                            }
                        },
                    };
                },
            }),
        ];
    },
});
