import React from 'react';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Type,
    Printer,
    FileText,
    Separator
} from 'lucide-react';

const Toolbar = ({ editor, onInsertPageBreak, onPrint, currentPage, totalPages }) => {
    if (!editor) return null;

    const ToolbarButton = ({ onClick, isActive, children, title }) => (
        <button
            onClick={onClick}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                }`}
            title={title}
            type="button"
        >
            {children}
        </button>
    );

    const ToolbarDivider = () => (
        <div className="w-px h-6 bg-gray-300 mx-1" />
    );

    return (
        <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-2 flex-wrap">
            {/* Text Formatting */}
            <div className="flex items-center gap-1">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Bold (Ctrl+B)"
                >
                    <Bold size={16} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Italic (Ctrl+I)"
                >
                    <Italic size={16} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    title="Underline (Ctrl+U)"
                >
                    <Underline size={16} />
                </ToolbarButton>
            </div>

            <ToolbarDivider />

            {/* Headings */}
            <div className="flex items-center gap-1">
                <select
                    value={
                        editor.isActive('heading', { level: 1 }) ? 'h1' :
                            editor.isActive('heading', { level: 2 }) ? 'h2' :
                                editor.isActive('heading', { level: 3 }) ? 'h3' :
                                    'paragraph'
                    }
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === 'paragraph') {
                            editor.chain().focus().setParagraph().run();
                        } else {
                            const level = parseInt(value.replace('h', ''));
                            editor.chain().focus().toggleHeading({ level }).run();
                        }
                    }}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="paragraph">Normal</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                </select>
            </div>

            <ToolbarDivider />

            {/* Lists */}
            <div className="flex items-center gap-1">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <List size={16} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Numbered List"
                >
                    <ListOrdered size={16} />
                </ToolbarButton>
            </div>

            <ToolbarDivider />

            {/* Page Controls */}
            <div className="flex items-center gap-1">
                <ToolbarButton
                    onClick={onInsertPageBreak}
                    title="Insert Page Break (Ctrl+Enter)"
                >
                    <FileText size={16} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={onPrint}
                    title="Print Document"
                >
                    <Printer size={16} />
                </ToolbarButton>
            </div>

            <ToolbarDivider />

            {/* Page Info */}
            <div className="flex items-center gap-2 text-sm text-gray-600 ml-auto">
                <span>Page {currentPage} of {totalPages}</span>
            </div>
        </div>
    );
};

export default Toolbar;