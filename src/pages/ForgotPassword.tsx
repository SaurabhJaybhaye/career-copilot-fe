import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      toast.success('Password reset link sent to your email!')
      setIsLoading(false)
      setEmail('')
    }, 800)
  }

  return (
    <div className="w-full">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Forgot Password?
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Enter your email address and we will send you a link to reset your password.
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1">
            Email address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md placeholder-slate-500 text-slate-900 dark:text-white bg-white dark:bg-slate-700 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
            placeholder="you@example.com"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <Link
            to="/login"
            className="font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400"
          >
            Back to login
          </Link>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Sending link...' : 'Send reset link'}
          </button>
        </div>
      </form>
    </div>
  )
}
