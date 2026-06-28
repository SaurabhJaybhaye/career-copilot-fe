import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { z } from 'zod'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { api } from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate using Zod
    const validationResult = forgotPasswordSchema.safeParse({ email })
    if (!validationResult.success) {
      setEmailError(validationResult.error.issues[0].message)
      return
    }

    setEmailError('')
    setIsLoading(true)

    try {
      await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
      toast.success('Password reset link sent to your email!')
      setEmail('')
    } catch (err: any) {
      const message = err.message || 'Failed to send reset link. Please try again.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full text-left space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Forgot Password?
        </h2>
        <p className="mt-2 text-sm text-slate-655 dark:text-slate-400">
          Enter your email address and we will send you a link to reset your password.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          disabled={isLoading}
          required
        />

        <div className="flex items-center justify-between text-sm">
          <Link
            to="/login"
            className="font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400"
          >
            Back to login
          </Link>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center"
            isLoading={isLoading}
          >
            Send reset link
          </Button>
        </div>
      </form>
    </div>
  )
}
