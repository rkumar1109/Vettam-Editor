import React from 'react';

const Footer = ({ pageNumber, totalPages }) => {
    return (
        <div
            className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-between px-4 pb-4 text-sm text-gray-600 border-t border-gray-200"
            style={{
                position: 'absolute',
                bottom: '0.5in',
                left: '1in',
                right: '1in',
                height: '0.5in'
            }}
        >
            <div>
                Confidential & Privileged
            </div>
            <div className="font-medium">
                Page {pageNumber} of {totalPages}
            </div>
            <div>
                Attorney Work Product
            </div>
        </div>
    );
};

export default Footer;