import React, { useEffect, useMemo } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import PageBreakExtension from '../extensions/PageBreakExtension.js'

const defaultExtensions = [
	StarterKit,
	Placeholder.configure({ placeholder: '' }),
	TextAlign.configure({ types: ['heading', 'paragraph'] }),
	Underline,
	TextStyle,
	Color,
	Highlight,
	Table.configure({ resizable: true }),
	TableRow,
	TableHeader,
	TableCell,
	PageBreakExtension,
]

const PageEditor = ({ baseEditor, page, editable }) => {
	const pageContentJSON = useMemo(() => {
		if (!baseEditor?.state || !page) return null
		const slice = baseEditor.state.doc.slice(page.startPos, page.endPos)
		const docNode = baseEditor.schema.node('doc', null, slice.content)
		return docNode.toJSON()
	}, [baseEditor, page?.startPos, page?.endPos])

	const localEditor = useEditor({
		extensions: defaultExtensions,
		content: pageContentJSON || '',
		editable: !!editable,
		editorProps: {
			attributes: {
				class: 'focus:outline-none',
			},
		},
	})

	useEffect(() => {
		if (localEditor && pageContentJSON) {
			localEditor.commands.setContent(pageContentJSON, false)
		}
	}, [localEditor, pageContentJSON])

	useEffect(() => {
		if (!localEditor || !baseEditor || !editable) return
		const handleUpdate = () => {
			try {
				const json = localEditor.getJSON()
				const content = Array.isArray(json.content) ? json.content : []
		
				baseEditor.chain().focus().insertContentAt({ from: page.startPos, to: page.endPos }, content).run()
			} catch (e) {
		
			}
		}
		localEditor.on('update', handleUpdate)
		return () => {
			localEditor.off('update', handleUpdate)
		}
	}, [localEditor, baseEditor, editable, page?.startPos, page?.endPos])

	return <EditorContent editor={localEditor} />
}

export default PageEditor
