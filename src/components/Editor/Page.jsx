import React, { forwardRef } from 'react';
import Header from '../Pagination/Header';
import Footer from '../Pagination/Footer';

const Page = forwardRef(({ pageNumber, totalPages, isActive, children }, ref) => {
    return (
        <div
            ref={ref}
            className={`bg-white shadow-lg mx-auto relative page-container ${isActive ? 'ring-2 ring-blue-300' : ''}`}
            style={{
                width: '8.27in', // A4 width
                minHeight: '11.69in', // A4 height
                padding: '1in', // 1 inch margins
                paddingTop: '1.5in', // Extra space for header
                paddingBottom: '1.5in', // Extra space for footer
            }}
        >
            {/* Header */}
            <Header pageNumber={pageNumber} totalPages={totalPages} />

            {/* Content Area */}
            <div className="page-content" style={{ minHeight: '8.69in' }}>
                {children}
            </div>

            {/* Footer */}
            <Footer pageNumber={pageNumber} totalPages={totalPages} />

            {/* Page break indicator for print */}
            <div
                className="page-break-after"
                style={{
                    pageBreakAfter: 'always',
                    breakAfter: 'page',
                    height: 0,
                    visibility: 'hidden'
                }}
            />
        </div>
    );
});

Page.displayName = 'Page';

export default Page;