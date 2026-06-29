import React, { useEffect } from 'react'
import { X, AlertTriangle, CheckCircle2, Info, HelpCircle } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  variant?: 'default' | 'danger' | 'success' | 'info'
  closable?: boolean
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  variant = 'default',
  closable = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && closable) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, closable])

  if (!isOpen) return null

  const variantIcons = {
    default: <HelpCircle className="h-6 w-6 text-violet-500" />,
    danger: <AlertTriangle className="h-6 w-6 text-red-500" />,
    success: <CheckCircle2 className="h-6 w-6 text-emerald-500" />,
    info: <Info className="h-6 w-6 text-blue-500" />,
  }

  const variantBorders = {
    default: 'border-violet-100 dark:border-violet-900/30',
    danger: 'border-red-100 dark:border-red-950/30',
    success: 'border-emerald-100 dark:border-emerald-950/30',
    info: 'border-blue-100 dark:border-blue-950/30',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in-0"
        onClick={() => closable && onClose()}
      />

      <div className="relative z-10 isolate bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden transform transition-all duration-300 animate-in fade-in-50 zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${variantBorders[variant]} bg-slate-50/50 dark:bg-slate-900/20`}>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">{variantIcons[variant]}</div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-6">
              {title}
            </h3>
          </div>
          {closable && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-650 dark:hover:text-slate-200 transition cursor-pointer focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-6 flex-1 overflow-y-auto text-left text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-700/60 flex justify-end items-center space-x-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
