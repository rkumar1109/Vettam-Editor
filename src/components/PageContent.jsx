import React from 'react'
import { EditorContent } from '@tiptap/react'

const PageContent = ({ editor, page, isActivePage }) => {
  if (!editor || !page) {
    return <div className="page-content-placeholder">Loading...</div>
  }

  const contentHeight = 247 
  const contentHeightPx = contentHeight * 3.779527559
  
  const startPos = page.startPos
  const endPos = page.endPos
  
  const contentStyle = {
    position: 'relative',
    height: `${contentHeightPx}px`,
    overflow: 'hidden',
    pointerEvents: isActivePage ? 'auto' : 'none',
    opacity: isActivePage ? 1 : 0.7,
  }


  const editorStyle = page.isFirstPage ? {} : {
    transform: `translateY(-${startPos * 0.1}px)`,
    position: 'relative',
  }

  return (
    <div className="page-content" style={contentStyle}>
      <div style={editorStyle}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default PageContent 