import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Separator } from 'lucide-react';
import { Minus } from 'lucide-react';

const PageBreak = ({ node, deleteNode }) => {
    return (
        <NodeViewWrapper className="page-break-wrapper">
            <div
                className="page-break-indicator flex items-center justify-center py-4 my-4 border-t-2 border-b-2 border-dashed border-gray-300 bg-gray-50 group hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={deleteNode}
                title="Click to remove page break"
                style={{
                    pageBreakBefore: 'always',
                    breakBefore: 'page'
                }}
            >
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Minus size={16} />
                    <span>Page Break</span>
                    <span className="opacity-0 group-hover:opacity-100 text-xs">(click to remove)</span>
                </div>
            </div>
        </NodeViewWrapper>
    );
};

export default PageBreak;