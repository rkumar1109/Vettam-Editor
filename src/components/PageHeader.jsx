import React from 'react'

const PageHeader = ({ title, date, pageNumber, totalPages }) => {
  return (
    <div className="page-header">
      <div className="header-left">
        <strong>{title}</strong>
      </div>
      <div className="header-center">
        <span>Page {pageNumber} of {totalPages}</span>
      </div>
      <div className="header-right">
        <span>{date}</span>
      </div>
    </div>
  )
}

export default PageHeader 