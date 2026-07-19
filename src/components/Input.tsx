import React, { useState } from 'react'
import { Eye, EyeOff, Search } from 'lucide-react'

// Common styling classes for inputs (standard Tailwind dark theme colors)
const inputBaseClasses = 'appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl placeholder-slate-400 text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 text-sm shadow-sm disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed'
const errorClasses = 'border-red-500 focus:ring-red-500 dark:border-red-500'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input: React.FC<InputProps> = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', disabled, ...props }, ref) => {
    const isError = !!error

    return (
      <div className="w-full text-left space-y-1.5">
        {label && (
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            disabled={disabled}
            className={`${inputBaseClasses} ${isError ? errorClasses : ''} ${className}`}
            {...props}
          />
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

Input.displayName = 'Input'

export const PasswordInput: React.FC<InputProps> = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isError = !!error

    const togglePasswordVisibility = () => {
      if (!disabled) {
        setShowPassword((prev) => !prev)
      }
    }

    return (
      <div className="w-full text-left space-y-1.5">
        {label && (
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            disabled={disabled}
            className={`${inputBaseClasses} pr-11 ${isError ? errorClasses : ''} ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={disabled}
            className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none p-1 rounded-md"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
          </button>
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

PasswordInput.displayName = 'PasswordInput'

export const SearchInput: React.FC<InputProps> = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', disabled, ...props }, ref) => {
    const isError = !!error

    return (
      <div className="w-full text-left space-y-1.5">
        {label && (
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
            {label}
          </label>
        )}
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </div>
          <input
            ref={ref}
            disabled={disabled}
            className={`${inputBaseClasses} pl-11 ${isError ? errorClasses : ''} ${className}`}
            {...props}
          />
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

SearchInput.displayName = 'SearchInput'

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const TextArea: React.FC<TextAreaProps> = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, className = '', disabled, rows = 4, ...props }, ref) => {
    const isError = !!error

    return (
      <div className="w-full text-left space-y-1.5">
        {label && (
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            disabled={disabled}
            rows={rows}
            className={`${inputBaseClasses} ${isError ? errorClasses : ''} ${className}`}
            {...props}
          />
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

TextArea.displayName = 'TextArea'
