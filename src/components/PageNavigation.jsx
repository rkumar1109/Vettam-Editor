import React from 'react'

const PageNavigation = ({ currentPage, totalPages, onPageChange }) => {
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePageClick = (pageIndex) => {
    onPageChange(pageIndex)
  }

  return (
    <div className="page-navigation">
      <button 
        onClick={handlePreviousPage}
        disabled={currentPage === 0}
        className="nav-button"
        title="Previous Page"
      >
        ← Previous
      </button>
      
      <div className="page-indicators">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index)}
            className={`page-indicator ${index === currentPage ? 'active' : ''}`}
            title={`Page ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      
      <button 
        onClick={handleNextPage}
        disabled={currentPage === totalPages - 1}
        className="nav-button"
        title="Next Page"
      >
        Next →
      </button>
    </div>
  )
}

export default PageNavigation 