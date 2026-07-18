import React from 'react'

interface MarkdownPreviewProps {
  content: string
  className?: string
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, className = '' }) => {
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n')
    const elements: React.ReactNode[] = []
    let listItems: React.ReactNode[] = []

    const flushList = (key: string | number) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${key}`} className="list-disc pl-5 mb-4 space-y-1 text-slate-700 dark:text-slate-300">
            {listItems}
          </ul>
        )
        listItems = []
      }
    }

    const parseInlineStyles = (lineText: string) => {
      // Regex to parse **bold** text
      const parts = lineText.split(/(\*\*.*?\*\*)/g)
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-extrabold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>
        }
        return part
      })
    }

    lines.forEach((line, idx) => {
      const trimmed = line.trim()

      // Horizontal Rule
      if (trimmed === '---' || trimmed === '***') {
        flushList(idx)
        elements.push(<hr key={idx} className="my-4 border-slate-250 dark:border-slate-750" />)
        return
      }

      // Heading 1
      if (trimmed.startsWith('# ')) {
        flushList(idx)
        elements.push(
          <h1 key={idx} className="text-xl font-black text-slate-900 dark:text-white mt-5 mb-3 border-b pb-1.5 border-slate-200 dark:border-slate-700">
            {parseInlineStyles(trimmed.substring(2))}
          </h1>
        )
        return
      }

      // Heading 2
      if (trimmed.startsWith('## ')) {
        flushList(idx)
        elements.push(
          <h2 key={idx} className="text-base font-bold text-slate-800 dark:text-slate-100 mt-5 mb-2 border-b pb-1 border-slate-150 dark:border-slate-800">
            {parseInlineStyles(trimmed.substring(3))}
          </h2>
        )
        return
      }

      // Heading 3
      if (trimmed.startsWith('### ')) {
        flushList(idx)
        elements.push(
          <h3 key={idx} className="text-sm font-bold text-slate-700 dark:text-slate-250 mt-4 mb-2">
            {parseInlineStyles(trimmed.substring(4))}
          </h3>
        )
        return
      }

      // Bullet List Item
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        listItems.push(
          <li key={`li-${idx}`} className="text-xs text-slate-650 dark:text-slate-350 font-medium">
            {parseInlineStyles(trimmed.substring(2))}
          </li>
        )
        return
      }

      // Empty Line
      if (trimmed === '') {
        flushList(idx)
        return
      }

      // Normal Paragraph
      flushList(idx)
      elements.push(
        <p key={idx} className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed mb-3">
          {parseInlineStyles(trimmed)}
        </p>
      )
    })

    flushList('final')
    return elements
  }

  return (
    <div className={`p-6 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-700 rounded-xl overflow-y-auto max-h-[500px] text-left select-text ${className}`}>
      {parseMarkdown(content)}
    </div>
  )
}
export default MarkdownPreview
