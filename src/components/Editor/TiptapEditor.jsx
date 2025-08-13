import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import HardBreak from '@tiptap/extension-hard-break';
import History from '@tiptap/extension-history';
import { PageBreak } from '../../extensions/PageBreakExtension';
import { Pagination } from '../../extensions/PaginationExtension';
import Toolbar from './Toolbar';
import PageContainer from './PageContainer';
import { v4 as uuidv4 } from 'uuid';

const TiptapEditor = () => {
    const [pages, setPages] = useState(() => [{ id: uuidv4(), content: '' }]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const editorRef = useRef(null);
    const pageRefs = useRef({});

    const handlePageChange = useCallback(({ currentPage, totalPages }) => {
        setCurrentPage(currentPage);
        setTotalPages(totalPages);
    }, []);

    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            Bold,
            Italic,
            Underline,
            Heading.configure({ levels: [1, 2, 3] }),
            BulletList,
            OrderedList,
            ListItem,
            HardBreak,
            History,
            PageBreak,
            Pagination.configure({ onPageChange: handlePageChange })
        ],
        content: `<h1>Legal Document Example</h1><p>...</p>`,
        onUpdate: () => checkForAutomaticPageBreaks()
    });

    const checkForAutomaticPageBreaks = useCallback(() => {
        if (!editorRef.current) return;
        const editorElement = editorRef.current.querySelector('.ProseMirror');
        if (!editorElement) return;

        const pageHeight = 1056;
        const contentHeight = editorElement.scrollHeight;
        const newTotalPages = Math.ceil(contentHeight / pageHeight);

        if (newTotalPages !== totalPages) {
            setTotalPages(newTotalPages);
            setPages(prevPages =>
                Array.from({ length: newTotalPages }, (_, i) => ({
                    id: prevPages[i]?.id || uuidv4(),
                    content: ''
                }))
            );
        }
    }, [totalPages]);

    const insertPageBreak = useCallback(() => {
        editor?.commands.insertPageBreak();
    }, [editor]);

    const printDocument = useCallback(() => window.print(), []);

    useEffect(() => {
        if (!editorRef.current) return;
        const editorElement = editorRef.current.querySelector('.ProseMirror');
        if (!editorElement) return;

        const resizeObserver = new ResizeObserver(checkForAutomaticPageBreaks);
        resizeObserver.observe(editorElement);
        return () => resizeObserver.disconnect();
    }, [checkForAutomaticPageBreaks]);

    if (!editor) {
        return <div className="flex items-center justify-center h-64">Loading editor...</div>;
    }

    return (
        <div className="w-full h-full">
            <Toolbar
                editor={editor}
                onInsertPageBreak={insertPageBreak}
                onPrint={printDocument}
                currentPage={currentPage}
                totalPages={totalPages}
            />
            <div className="flex-1 overflow-auto bg-gray-100 p-8">
                <PageContainer pages={pages} currentPage={currentPage} totalPages={totalPages} pageRefs={pageRefs}>
                    <div ref={editorRef} className="tiptap-editor">
                        <EditorContent editor={editor} />
                    </div>
                </PageContainer>
            </div>
        </div>
    );
};

export default TiptapEditor;
