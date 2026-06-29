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
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in-0"
        onClick={() => closable && onClose()}
      />

      <div className="relative z-10 isolate bg-white dark:bg-slate-800 w-full md:w-[40%] md:min-w-[450px] shadow-2xl border-l border-slate-200 dark:border-slate-700 flex flex-col h-full transform transition-transform duration-300 animate-in slide-in-from-right">
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${variantBorders[variant]} bg-slate-50/50 dark:bg-slate-900/20`}>
          <div className="flex items-start space-x-3 flex-1 min-w-0 mr-4">
            <div className="flex-shrink-0 mt-0.5">{variantIcons[variant]}</div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-6 whitespace-normal break-words">
              {title}
            </h3>
          </div>
          <div className="flex items-center space-x-3 flex-shrink-0">
            {footer && <div className="flex items-center space-x-2 mr-2">{footer}</div>}
            {closable && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-650 dark:hover:text-slate-200 transition cursor-pointer focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 flex-1 overflow-y-auto text-left text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}
