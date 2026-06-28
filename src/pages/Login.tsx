import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { z } from 'zod'
import { Input, PasswordInput } from '@/components/Input'
import { Button } from '@/components/Button'
import { useAppDispatch } from '@/hooks/store'
import { setCredentials } from '@/features/auth/authSlice'
import { api } from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate using Zod
    const validationResult = loginSchema.safeParse({ email, password })
    if (!validationResult.success) {
      const errors: Record<string, string> = {}
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path[0] as string
        errors[path] = issue.message
      })
      setFormErrors(errors)
      return
    }

    setFormErrors({})
    setIsLoading(true)

    try {
      // Connect to real backend
      const response = await api.post<{
        success: boolean
        message: string
        data: {
          user: any
          accessToken: string
          refreshToken: string
        }
      }>(API_ENDPOINTS.AUTH.LOGIN, { email, password })

      const { user, accessToken, refreshToken } = response.data || {}

      if (accessToken && user) {
        dispatch(setCredentials({ user, accessToken, refreshToken }))
        toast.success('Successfully logged in!')
        navigate('/dashboard')
      } else {
        throw new Error('Invalid response structure from authentication server')
      }
    } catch (err: any) {
      const message = err.message || 'Login failed. Please verify your credentials.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBypass = () => {
    // Developer bypass simulating a successful session
    const mockUser = {
      id: 'mock_user_123',
      email: 'developer@example.com',
      firstName: 'Saurabh',
      lastName: 'Jaybhaye',
      role: 'user',
      preferences: { theme: 'light' as const, notificationsEnabled: true },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    dispatch(
      setCredentials({
        user: mockUser,
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
      })
    )
    
    toast.success('Bypassed authentication (Dev mode)')
    navigate('/dashboard')
  }

  return (
    <div className="w-full text-left space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-slate-655 dark:text-slate-400">
          Or{' '}
          <Link to="/signup" className="font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400">
            create a new account
          </Link>
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={formErrors.email}
          disabled={isLoading}
          required
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-slate-755 dark:text-slate-205">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400"
              tabIndex={-1}
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={formErrors.password}
            disabled={isLoading}
            required
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center"
            isLoading={isLoading}
          >
            Sign in
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center border-t border-slate-100 dark:border-slate-700/60 pt-4">
        <button
          onClick={handleBypass}
          className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350 underline cursor-pointer"
        >
          Developer Bypass (Simulate Login)
        </button>
      </div>
    </div>
  )
}
