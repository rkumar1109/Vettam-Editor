import { useState, useEffect, useCallback } from 'react'

const MM_TO_PX = 3.779527559 // 96dpi
const A4_HEIGHT_MM = 297
const MARGIN_TOP_MM = 25
const MARGIN_BOTTOM_MM = 25
const CONTENT_HEIGHT_PX = (A4_HEIGHT_MM - MARGIN_TOP_MM - MARGIN_BOTTOM_MM) * MM_TO_PX

const LINE_HEIGHT_PX = 24

export const usePagination = (editor) => {
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const calculatePageBreaks = useCallback(() => {
    if (!editor || !editor.view) return []

    const { state, view } = editor
    const { doc } = state

    const pageBreaks = []
    let currentHeightPx = 0
    let pageNumber = 1

    
    doc.content.forEach((node, offset) => {
      const pos = offset + 1 

      if (node.type.name === 'pageBreak') {
        pageBreaks.push({ position: pos, type: 'manual', pageNumber })
        pageNumber++
        currentHeightPx = 0
        return
      }


      let nodeHeightPx = 0
      try {
        const dom = view.nodeDOM(pos)
        if (dom && dom.getBoundingClientRect) {
          const rect = dom.getBoundingClientRect()
          nodeHeightPx = Math.max(rect.height, LINE_HEIGHT_PX)
        }
      } catch (_) {

      }

      if (!nodeHeightPx) {

        const textLen = node.textContent ? node.textContent.length : 0
        const lines = Math.max(1, Math.ceil(textLen / 80))
        let factor = 1
        if (node.type.name === 'heading') factor = 1.3
        if (node.type.name === 'bulletList' || node.type.name === 'orderedList') factor = 1.2
        if (node.type.name === 'table') factor = 2
        nodeHeightPx = Math.round(lines * LINE_HEIGHT_PX * factor)
      }


      if (offset > 0) nodeHeightPx += Math.round(LINE_HEIGHT_PX * 0.5)


      if (currentHeightPx + nodeHeightPx > CONTENT_HEIGHT_PX) {
        pageBreaks.push({ position: pos, type: 'auto', pageNumber })
        pageNumber++
        currentHeightPx = nodeHeightPx
      } else {
        currentHeightPx += nodeHeightPx
      }
    })

    return pageBreaks
  }, [editor])

  const splitContentIntoPages = useCallback(() => {
    if (!editor || !editor.view) return []

    const { state } = editor
    const { doc } = state
    const pageBreaks = calculatePageBreaks()

    if (pageBreaks.length === 0) {
      return [{
        id: 1,
        content: doc,
        pageNumber: 1,
        startPos: 0,
        endPos: doc.content.size,
        isFirstPage: true,
        isLastPage: true,
      }]
    }

    const resultPages = []
    let startPos = 0

    pageBreaks.forEach((breakInfo, index) => {
      const endPos = breakInfo.position
      const pageContent = doc.slice(startPos, endPos)

      resultPages.push({
        id: index + 1,
        content: pageContent,
        pageNumber: breakInfo.pageNumber,
        startPos,
        endPos,
        hasManualBreak: breakInfo.type === 'manual',
        isFirstPage: index === 0,
        isLastPage: false,
      })

      startPos = endPos
    })

    if (startPos < doc.content.size) {
      const lastPageContent = doc.slice(startPos)
      resultPages.push({
        id: resultPages.length + 1,
        content: lastPageContent,
        pageNumber: resultPages.length + 1,
        startPos,
        endPos: doc.content.size,
        isFirstPage: resultPages.length === 0,
        isLastPage: true,
      })
    }

    if (resultPages.length > 0) resultPages[resultPages.length - 1].isLastPage = true

    return resultPages
  }, [editor, calculatePageBreaks])

  useEffect(() => {
    if (!editor) return

    const updatePages = () => {
      const newPages = splitContentIntoPages()
      setPages(newPages)
    }

 
    editor.on('update', updatePages)

    const id = setTimeout(updatePages, 0)

    return () => {
      clearTimeout(id)
      editor.off('update', updatePages)
    }
  }, [editor, splitContentIntoPages])

  const insertPageBreak = useCallback(() => {
    if (editor) editor.commands.setPageBreak({ type: 'manual' })
  }, [editor])

  const getPageContent = useCallback((pageId) => pages.find(page => page.id === pageId), [pages])
  const getTotalPages = useCallback(() => pages.length, [pages])

  return {
    pages,
    currentPage,
    setCurrentPage,
    insertPageBreak,
    getPageContent,
    getTotalPages,
    calculatePageBreaks,
  }
}