/**
 * Forgot Password Page
 * Request password reset link via email
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/utils/validation'
import { forgotPassword } from '@/services/authService'
import { useToast } from '@/components/ui/toaster'
import {
  AuthLayout,
  FormInput,
  PrimaryButton,
} from '@/components'

export function ForgotPassword() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true)

    try {
      await forgotPassword({ email: data.email })

      setIsSuccess(true)
      toast({
        title: 'Reset Link Sent!',
        description: 'If an account exists with that email, you will receive a password reset link shortly.',
        variant: 'success',
        onClose: () => {},
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send reset link. Please try again.'
      toast({
        title: 'Error',
        description: message,
        variant: 'error',
        onClose: () => {},
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = () => {
    setIsSuccess(false)
    reset()
  }

  if (isSuccess) {
    return (
      <AuthLayout>
        <div className="card-auth text-center">
          <div className="mb-8 animate-in slide-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-sl-success/10 mb-6">
              <CheckCircle className="w-10 h-10 text-sl-success" aria-hidden="true" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-sl-text-primary">Check Your Email</h1>
            <p className="mt-3 text-sl-text-secondary max-w-md mx-auto">
              We've sent a password reset link to your email address. Please check your inbox (and spam folder) and follow the instructions to reset your password.
            </p>
          </div>

          <div className="mb-8 p-4 bg-sl-bg-input/50 border border-sl-border/50 rounded-xl animate-in slide-up">
            <div className="flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-sl-accent-secondary flex-shrink-0" aria-hidden="true" />
              <p className="text-sl-text-secondary">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={handleResend}
                  className="link-text underline"
                >
                  request another link
                </button>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-in slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/login" className="btn-primary">
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Back to Login
            </Link>
            <button
              onClick={handleResend}
              className="btn-secondary"
            >
              Resend Email
            </button>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="card-auth">
        <div className="text-center mb-8 animate-in slide-up">
          <h1 className="text-2xl lg:text-3xl font-bold text-sl-text-primary">Forgot Password?</h1>
          <p className="mt-2 text-sl-text-secondary">
            Enter your CSU email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <FormInput
            label="CSU Email Address"
            type="email"
            placeholder="student@csu.edu.ph"
            error={errors.email?.message}
            icon={<Mail className="w-5 h-5" />}
            autoComplete="email"
            {...register('email')}
          />

          <PrimaryButton
            type="submit"
            fullWidth
            loading={isSubmitting}
            className="mt-2"
          >
            Send Reset Link
            <Lock className="ml-2 w-5 h-5" aria-hidden="true" />
          </PrimaryButton>
        </form>

        <div className="mt-8 animate-in slide-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-center text-sl-text-secondary">
            Remember your password?{' '}
            <Link to="/login" className="link-text">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}