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
    const [pages, setPages] = useState([{ id: uuidv4(), content: '' }]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const editorRef = useRef(null);
    const pageRefs = useRef({});

    const handlePageChange = useCallback((paginationState) => {
        setCurrentPage(paginationState.currentPage);
        setTotalPages(paginationState.totalPages);
    }, []);

    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            Bold,
            Italic,
            Underline,
            Heading.configure({
                levels: [1, 2, 3],
            }),
            BulletList,
            OrderedList,
            ListItem,
            HardBreak,
            History,
            PageBreak,
            Pagination.configure({
                onPageChange: handlePageChange,
            }),
        ],
        content: `
      <h1>Legal Document Example</h1>
      <p>This is a sample legal document created with our Tiptap pagination editor. The editor supports automatic page breaks and professional formatting suitable for legal documents.</p>
      
      <h2>Section 1: Introduction</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      
      <h2>Section 2: Terms and Conditions</h2>
      <ul>
        <li>Term one with detailed explanation</li>
        <li>Term two with additional clauses</li>
        <li>Term three with legal implications</li>
      </ul>
      
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
    `,
        onUpdate: ({ editor }) => {
            // Debounced pagination check to prevent excessive calculations
            clearTimeout(window.paginationTimeout);
            window.paginationTimeout = setTimeout(() => {
                checkForAutomaticPageBreaks();
            }, 300);
        },
    });

    const checkForAutomaticPageBreaks = useCallback(() => {
        if (!editor) return;

        const html = editor.getHTML();

        // Offscreen container
        const sandbox = document.createElement('div');
        sandbox.style.position = 'absolute';
        sandbox.style.left = '-99999px';
        sandbox.style.top = '0';
        sandbox.style.width = '800px'; // match your editor content width
        sandbox.className = 'ProseMirror'; // so CSS matches
        sandbox.innerHTML = html;
        document.body.appendChild(sandbox);

        const pageHeight = 834; // px
        let currentHeight = 0;
        let breakPositions = [];
        const blocks = Array.from(sandbox.children);
        let docPos = 0; // track ProseMirror doc position

        blocks.forEach((block) => {
            const style = window.getComputedStyle(block);
            const blockHeight =
                block.offsetHeight +
                (parseFloat(style.marginTop) || 0) +
                (parseFloat(style.marginBottom) || 0);

            if (currentHeight + blockHeight > pageHeight) {
                breakPositions.push(docPos);
                currentHeight = 0;
            }

            currentHeight += blockHeight;
            docPos += block.textContent.length + 1; // rough PM position
        });

        document.body.removeChild(sandbox);

        // Remove existing breaks first
        editor.chain().focus().command(({ tr, state }) => {
            const { doc, schema } = state;
            const pageBreakType = schema.nodes.pageBreak;
            let newTr = tr;
            doc.descendants((node, pos) => {
                if (node.type === pageBreakType) {
                    newTr = newTr.delete(pos, pos + node.nodeSize);
                }
            });
            if (newTr.docChanged) {
                return newTr;
            }
            return false;
        }).run();

        // Insert new breaks at calculated positions
        breakPositions.forEach(pos => {
            editor.commands.insertContentAt(pos, { type: 'pageBreak' });
        });

        setTotalPages(breakPositions.length + 1);
    }, [editor]);

    const insertPageBreak = useCallback(() => {
        if (editor) {
            editor.commands.insertPageBreak();
        }
    }, [editor]);

    const printDocument = useCallback(() => {
        window.print();
    }, []);

    useEffect(() => {
        // Set up ResizeObserver for automatic pagination with debouncing
        if (editorRef.current && editor) {
            let timeoutId;

            const debouncedPaginationCheck = () => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    checkForAutomaticPageBreaks();
                }, 500); // Longer debounce for resize events
            };

            const resizeObserver = new ResizeObserver(debouncedPaginationCheck);

            const editorElement = editorRef.current.querySelector('.ProseMirror');
            if (editorElement) {
                resizeObserver.observe(editorElement);
            }

            // Initial calculation after component mount
            timeoutId = setTimeout(() => {
                checkForAutomaticPageBreaks();
            }, 1000);

            return () => {
                clearTimeout(timeoutId);
                resizeObserver.disconnect();
            };
        }
    }, [editor]); // Remove checkForAutomaticPageBreaks from dependencies to prevent loops

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
                <PageContainer
                    pages={pages}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageRefs={pageRefs}
                >
                    <div ref={editorRef} className="tiptap-editor">
                        <EditorContent editor={editor} />
                    </div>
                </PageContainer>
            </div>
        </div>
    );
};

export default TiptapEditor;