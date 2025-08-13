import React from 'react';

const Header = ({ pageNumber, totalPages }) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div
            className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-4 pt-4 text-sm text-gray-600 border-b border-gray-200"
            style={{
                position: 'absolute',
                top: '0.5in',
                left: '1in',
                right: '1in',
                height: '0.5in'
            }}
        >
            <div className="font-medium">
                Legal Document
            </div>
            <div>
                {currentDate}
            </div>
        </div>
    );
};

export default Header;