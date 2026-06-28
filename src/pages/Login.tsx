import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API Login
    setTimeout(() => {
      localStorage.setItem('token', 'mock_access_token')
      localStorage.setItem('refreshToken', 'mock_refresh_token')
      toast.success('Successfully logged in!')
      setIsLoading(false)
      navigate('/dashboard')
    }, 800)
  }

  const handleBypass = () => {
    localStorage.setItem('token', 'mock_access_token')
    localStorage.setItem('refreshToken', 'mock_refresh_token')
    toast.success('Bypassed authentication (Dev mode)')
    navigate('/dashboard')
  }

  return (
    <div className="w-full">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Or{' '}
          <Link to="/signup" className="font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400">
            create a new account
          </Link>
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm space-y-4">
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
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md placeholder-slate-500 text-slate-900 dark:text-white bg-white dark:bg-slate-700 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-slate-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-slate-900 dark:text-slate-350">
              Remember me
            </label>
          </div>

          <Link
            to="/forgot-password"
            className="font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400"
          >
            Forgot password?
          </Link>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <button
          onClick={handleBypass}
          className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-650 underline cursor-pointer"
        >
          Developer Bypass (Simulate Login)
        </button>
      </div>
    </div>
  )
}
