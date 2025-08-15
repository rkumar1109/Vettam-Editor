import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import PageBreakExtension from '../extensions/PageBreakExtension.js'
import { usePagination } from '../hooks/usePagination.js'
import EditorToolbar from './EditorToolbar.jsx'
import PageHeader from './PageHeader.jsx'
import PageFooter from './PageFooter.jsx'
import PageNavigation from './PageNavigation.jsx'
import PageEditor from './PageEditor.jsx'

const PaginatedEditor = () => {
  const [documentTitle, setDocumentTitle] = useState('Legal Document')
  const [documentDate, setDocumentDate] = useState(new Date().toLocaleDateString())
  const [activePage, setActivePage] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing your document...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      PageBreakExtension,
    ],
    content: `
      <h1>Legal Document</h1>
      <p>This is a sample legal document demonstrating the pagination features of our Tiptap-based editor. The document will automatically break into pages based on content length, and you can also insert manual page breaks using the toolbar button or Ctrl+Enter.</p>
      
      <h2>Section 1: Introduction</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      
      <h2>Section 2: Legal Provisions</h2>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
      
      <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
      
      <h3>Subsection 2.1: Specific Terms</h3>
      <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
      
      
      <p>The pagination system uses a sophisticated algorithm to calculate content height and determine where page breaks should occur. It takes into account different content types such as headings, paragraphs, lists, and tables, and estimates their height based on font sizes and content length.</p>
      
      <p>Manual page breaks can be inserted at any point in the document using the "Page Break" button in the toolbar or by pressing Ctrl+Enter (or Cmd+Enter on Mac). These manual breaks take precedence over automatic breaks and allow for precise control over page layout.</p>
      
      <h2>Section 6: Legal Compliance</h2>
      <p>This document editor is designed specifically for legal professionals who need to create documents that conform to standard legal formatting requirements. The A4 page layout, proper margins, and persistent headers and footers ensure that documents will print correctly and maintain their professional appearance.</p>
      
      <p>The page numbering system is essential for legal document referencing, and the ability to export documents in various formats ensures compatibility with existing legal workflows and document management systems.</p>
      
      <h3>Subsection 6.1: Document Standards</h3>
      <p>Legal documents must adhere to specific formatting standards to be accepted by courts and other legal institutions. This editor ensures that documents meet these requirements by providing consistent page layouts, proper typography, and professional formatting options.</p>
      
      <p>The print functionality preserves all formatting, headers, and footers, making it easy to produce professional-quality printed documents that meet legal standards.</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  })

  const {
    pages,
    insertPageBreak,
    getTotalPages
  } = usePagination(editor)

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    const content = editor.getHTML()
    const blob = new Blob([content], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePageClick = (pageIndex) => {
    setActivePage(pageIndex)
  }

  const handlePageChange = (pageIndex) => {
    setActivePage(pageIndex)
  }

  if (!editor) {
    return <div>Loading editor...</div>
  }

  return (
    <div className="editor-container">
      <EditorToolbar 
        editor={editor} 
        onInsertPageBreak={insertPageBreak}
        onPrint={handlePrint}
        onExport={handleExport}
        totalPages={getTotalPages()}
      />
      
      <PageNavigation 
        currentPage={activePage}
        totalPages={Math.max(1, getTotalPages())}
        onPageChange={handlePageChange}
      />
      
      <div className="pagination-wrapper">
        {pages.map((page, index) => (
          <div 
            key={page.id} 
            className={`page ${index === activePage ? 'active-page' : ''}`}
            onClick={() => handlePageClick(index)}
          >
            <PageHeader 
              title={documentTitle}
              date={documentDate}
              pageNumber={page.pageNumber}
              totalPages={pages.length}
            />
            
            <div className="page-content">
              <PageEditor 
                baseEditor={editor}
                page={page}
                editable={index === activePage}
              />
            </div>
            
            <PageFooter 
              pageNumber={page.pageNumber}
              totalPages={pages.length}
              date={documentDate}
            />
          </div>
        ))}
        
        {pages.length === 0 && (
          <div className="page active-page">
            <PageHeader 
              title={documentTitle}
              date={documentDate}
              pageNumber={1}
              totalPages={1}
            />
            
            <div className="page-content">
              <EditorContent editor={editor} />
            </div>
            
            <PageFooter 
              pageNumber={1}
              totalPages={1}
              date={documentDate}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default PaginatedEditor 