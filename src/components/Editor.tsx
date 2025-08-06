import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { PageBreak } from './PageBreak'
import { Header, Footer } from './HeaderFooter'
import Underline from '@tiptap/extension-underline'

const editor = useEditor({
  extensions: [
    StarterKit,
    PageBreak,
    Header,
    Footer,
    Underline
  ],
  content: `
    <header data-header>Case: Smith v. Jones</header>
    <p>This is page 1 content…</p>
    <hr data-page-break />
    <p>New content on page 2…</p>
    <footer data-footer>Page © 2025</footer>
  `
})
