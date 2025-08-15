import React from 'react'
import PaginatedEditor from './components/PaginatedEditor.jsx'

function App() {
  return (
    <div className="app">
      <div className="app-header">
        <h1 className="app-title">Tiptap Pagination Editor</h1>
        <p className="app-subtitle">
          A professional document editor with A4 pagination, page breaks, and headers/footers
        </p>
      </div>
      
      <PaginatedEditor />
    </div>
  )
}

export default App 