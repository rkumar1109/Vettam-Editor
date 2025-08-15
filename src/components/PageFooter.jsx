import React from 'react'

const PageFooter = ({ pageNumber, totalPages, date }) => {
  return (
    <div className="page-footer">
      <div className="footer-left">
        <span>Confidential</span>
      </div>
      <div className="footer-center">
        <span>Page {pageNumber} of {totalPages}</span>
      </div>
      <div className="footer-right">
        <span>{date}</span>
      </div>
    </div>
  )
}

export default PageFooter 