import React, { useRef, useEffect } from 'react';
import Page from './Page';

const PageContainer = ({ pages, currentPage, totalPages, pageRefs, children }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        // Initialize page refs
        pages.forEach(page => {
            if (!pageRefs.current[page.id]) {
                pageRefs.current[page.id] = React.createRef();
            }
        });
    }, [pages, pageRefs]);

    return (
        <div
            ref={containerRef}
            className="max-w-4xl mx-auto space-y-8"
            style={{ minHeight: 'calc(100vh - 200px)' }}
        >
            {/* Render pages */}
            {Array.from({ length: totalPages }, (_, index) => (
                <Page
                    key={index}
                    pageNumber={index + 1}
                    totalPages={totalPages}
                    isActive={currentPage === index + 1}
                    ref={pageRefs.current[pages[index]?.id]}
                >
                    {index === 0 && children}
                </Page>
            ))}

            {/* If no content, show at least one page */}
            {totalPages === 0 && (
                <Page
                    pageNumber={1}
                    totalPages={1}
                    isActive={true}
                >
                    {children}
                </Page>
            )}
        </div>
    );
};

export default PageContainer;