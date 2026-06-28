import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, X, Check } from 'lucide-react'

// Common styling classes for select fields (standard Tailwind color scales)
const selectBaseClasses = 'appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl placeholder-slate-400 text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 text-sm shadow-sm disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer'
const errorClasses = 'border-red-500 focus:ring-red-500 dark:border-red-500'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
  error?: string
  helperText?: string
  placeholder?: string
}

export const Select: React.FC<SelectProps> = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, placeholder = 'Select an option', className = '', disabled, ...props }, ref) => {
    const isError = !!error

    return (
      <div className="w-full text-left space-y-1.5">
        {label && (
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            className={`${selectBaseClasses} pr-11 ${isError ? errorClasses : ''} ${className}`}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
            <ChevronDown className="h-4.5 w-4.5" />
          </div>
        </div>
        {error && (
          <p className="text-xs font-semibold text-red-650 dark:text-red-400">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export interface MultiSelectProps {
  label?: string
  options: SelectOption[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  error?: string
  helperText?: string
  disabled?: boolean
  className?: string
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = 'Select options...',
  error,
  helperText,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const isError = !!error
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev)
    }
  }

  const handleSelectOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((val) => val !== value))
    } else {
      onChange([...selectedValues, value])
    }
  }

  const handleRemoveValue = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!disabled) {
      onChange(selectedValues.filter((val) => val !== value))
    }
  }

  return (
    <div className={`w-full text-left space-y-1.5 ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          onClick={toggleDropdown}
          className={`${selectBaseClasses} min-h-[46px] pr-10 flex flex-wrap gap-1.5 items-center ${
            isError ? errorClasses : ''
          } ${isOpen ? 'ring-2 ring-violet-500 border-transparent' : ''}`}
        >
          {selectedValues.length === 0 ? (
            <span className="text-slate-450 select-none">{placeholder}</span>
          ) : (
            selectedValues.map((val) => {
              const matchedOption = options.find((opt) => opt.value === val)
              return (
                <span
                  key={val}
                  className="inline-flex items-center text-xs font-bold bg-violet-50 text-violet-650 dark:bg-violet-950/40 dark:text-violet-400 pl-2.5 pr-1.5 py-1 rounded-lg border border-violet-100/50 dark:border-violet-800/40 transition"
                >
                  {matchedOption ? matchedOption.label : val}
                  <button
                    type="button"
                    onClick={(e) => handleRemoveValue(val, e)}
                    disabled={disabled}
                    className="ml-1 text-violet-400 hover:text-violet-600 dark:hover:text-violet-200 transition focus:outline-none cursor-pointer p-0.5 rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )
            })
          )}

          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-450 pointer-events-none">
            <ChevronDown className="h-4.5 w-4.5" />
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-805 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl max-h-60 overflow-y-auto py-1.5 animate-in fade-in-50 zoom-in-95 duration-100">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-400 dark:text-slate-500 text-center select-none">
                No options available
              </div>
            ) : (
              options.map((opt) => {
                const isSelected = selectedValues.includes(opt.value)
                return (
                  <div
                    key={opt.value}
                    onClick={() => handleSelectOption(opt.value)}
                    className={`flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer select-none ${
                      isSelected ? 'font-semibold text-violet-650 dark:text-violet-400 bg-violet-50/30 dark:bg-violet-950/20' : ''
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-4 w-4 text-violet-600 dark:text-violet-400" />}
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs font-semibold text-red-600 dark:text-red-400">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  )
}
