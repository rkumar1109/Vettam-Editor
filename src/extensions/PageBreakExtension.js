import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import PageBreakComponent from '../components/PageBreakComponent.jsx'

export default Node.create({
  name: 'pageBreak',
  
  group: 'block',
  
  atom: true,
  
  selectable: true,
  
  draggable: true,
  
  inline: false,
  
  addAttributes() {
    return {
      type: {
        default: 'manual',
        parseHTML: element => element.getAttribute('data-type') || 'manual',
        renderHTML: attributes => ({
          'data-type': attributes.type,
        }),
      },
      pageNumber: {
        default: null,
        parseHTML: element => element.getAttribute('data-page-number'),
        renderHTML: attributes => ({
          'data-page-number': attributes.pageNumber,
        }),
      },
    }
  },
  
  parseHTML() {
    return [
      {
        tag: 'div[data-type="page-break"]',
      },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'page-break' })]
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(PageBreakComponent)
  },
  
  addCommands() {
    return {
      setPageBreak: (attributes = {}) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
        })
      },
    }
  },
  
  addKeyboardShortcuts() {
    return {
      'Ctrl-Enter': () => this.editor.commands.setPageBreak({ type: 'manual' }),
      'Cmd-Enter': () => this.editor.commands.setPageBreak({ type: 'manual' }),
    }
  },
}) 