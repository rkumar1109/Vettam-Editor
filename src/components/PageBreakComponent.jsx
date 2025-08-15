import React from 'react'
import { NodeViewWrapper } from '@tiptap/react'

const PageBreakComponent = ({ node, deleteNode }) => {
  const handleClick = () => {
    if (confirm('Delete this page break?')) {
      deleteNode()
    }
  }

  return (
    <NodeViewWrapper>
      <div 
        className={`page-break ${node.attrs.type}`}
        onClick={handleClick}
        title="Click to delete page break"
      />
    </NodeViewWrapper>
  )
}

export default PageBreakComponent 