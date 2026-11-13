/**
 * SignUp Page
 * Multi-step registration: Personal Info → Role Selection → Password
 */

import { useState, useEffect, Fragment } from 'react'

function getStrengthBgColor(textColor: string): string {
  const colorMap: Record<string, string> = {
    'text-sl-error': 'var(--sl-error)',
    'text-yellow-500': 'var(--sl-warning)',
    'text-sl-accent-secondary': 'var(--sl-accent-secondary)',
    'text-sl-success': 'var(--sl-success)',
  }
  return colorMap[textColor] || 'var(--sl-accent-primary)'
}
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, User, GraduationCap, Lock, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import {
  registerSchema,
  type RegisterFormData,
} from '@/utils/validation'
import { register as registerUser } from '@/services/authService'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/toaster'
import { getPasswordStrength, PASSWORD_REQUIREMENTS } from '@/utils/validation'
import {
  AuthLayout,
  FormInput,
  PasswordInput,
  RoleSelector,
  PrimaryButton,
} from '@/components'
import { cn } from '@/utils'

type FormData = RegisterFormData

const steps = [
  { id: 1, title: 'Personal Info', description: 'Tell us about yourself' },
  { id: 2, title: 'Role', description: 'How will you use StudyLink?' },
  { id: 3, title: 'Security', description: 'Secure your account' },
]

export function SignUp() {
  const navigate = useNavigate()
  const { login: setAuthUser, setLoading } = useAuth()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number
    label: string
    color: string
    passedRequirements: string[]
    failedRequirements: string[]
  }>({ score: 0, label: '', color: '', passedRequirements: [], failedRequirements: [] })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      course: '',
      password: '',
      confirmPassword: '',
      role: undefined,
    },
    mode: 'onChange',
  })

  const watchedPassword = watch('password')
  const watchedRole = watch('role')

  // Update password strength when password changes
  useEffect(() => {
    if (watchedPassword) {
      setPasswordStrength(getPasswordStrength(watchedPassword))
    } else {
      setPasswordStrength({ score: 0, label: '', color: '', passedRequirements: [], failedRequirements: [] })
    }
  }, [watchedPassword])

  const nextStep = async () => {
    const stepFields: Record<number, Array<keyof FormData>> = {
      1: ['fullName', 'email', 'course'],
      2: ['role'],
      3: ['password', 'confirmPassword'],
    }
    const fieldsToValidate = stepFields[currentStep] || []
    const isValid = await trigger(fieldsToValidate)
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setLoading(true)
    clearErrors()

    try {
      const response = await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        course: data.course,
        role: data.role,
      })

      setAuthUser(response.user)

      toast({
        title: 'Account Created!',
        description: `Welcome to StudyLink, ${response.user.fullName}!`,
        variant: 'success',
        onClose: () => {},
      })

      navigate('/dashboard')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed. Please try again.'
      if (message.includes('email') || message.includes('Email')) {
        setError('email', { type: 'manual', message })
      } else {
        toast({
          title: 'Registration Failed',
          description: message,
          variant: 'error',
          onClose: () => {},
        })
      }
    } finally {
      setIsSubmitting(false)
      setLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-5 animate-in slide-up">
      <FormInput
        label="Full Name"
        type="text"
        placeholder="Juan Dela Cruz"
        error={errors.fullName?.message}
        icon={<User className="w-5 h-5" />}
        autoComplete="name"
        id="fullName"
        {...register('fullName')}
      />

      <FormInput
        label="CSU Email Address"
        type="email"
        placeholder="student@csu.edu.ph"
        error={errors.email?.message}
        icon={<Mail className="w-5 h-5" />}
        autoComplete="email"
        id="email"
        {...register('email')}
      />

      <FormInput
        label="Course / Program"
        type="text"
        placeholder="e.g., BS Computer Science"
        error={errors.course?.message}
        icon={<GraduationCap className="w-5 h-5" />}
        autoComplete="off"
        id="course"
        {...register('course')}
      />
    </div>
  )

  const renderStep2 = () => (
    <div className="animate-in slide-up">
      <RoleSelector
        value={watchedRole}
        onChange={(role) => setValue('role', role, { shouldValidate: true })}
        error={errors.role?.message}
      />
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-5 animate-in slide-up">
      <PasswordInput
        label="Password"
        placeholder="Create a strong password"
        error={errors.password?.message}
        icon={<Lock className="w-5 h-5" />}
        autoComplete="new-password"
        showStrength
        strengthTarget="password"
        id="password"
        {...register('password')}
      />

      {watchedPassword && (
        <div className="mt-3 p-4 bg-sl-bg-input/50 border border-sl-border/50 rounded-xl animate-in slide-down" role="region" aria-label="Password requirements">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-1.5 bg-sl-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(passwordStrength.score / PASSWORD_REQUIREMENTS.length) * 100}%`,
                  backgroundColor: getStrengthBgColor(passwordStrength.color),
                }}
              />
            </div>
            <span className={cn('text-sm font-medium', passwordStrength.color)}>{passwordStrength.label}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {PASSWORD_REQUIREMENTS.map((req, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5"
                style={{ color: passwordStrength.passedRequirements.includes(req.label) ? 'var(--sl-success)' : 'var(--sl-text-secondary)' }}
              >
                <CheckCircle
                  className={cn('w-3.5 h-3.5 flex-shrink-0', passwordStrength.passedRequirements.includes(req.label) ? 'text-sl-success' : 'text-sl-border')}
                  aria-hidden="true"
                />
                <span className={passwordStrength.passedRequirements.includes(req.label) ? 'line-through' : ''}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <PasswordInput
        label="Confirm Password"
        placeholder="Confirm your password"
        error={errors.confirmPassword?.message}
        icon={<Lock className="w-5 h-5" />}
        autoComplete="new-password"
        id="confirmPassword"
        {...register('confirmPassword')}
      />
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      default:
        return null
    }
  }

  return (
    <AuthLayout>
      <div className="card-auth">
        {/* Progress Indicator */}
        <div className="mb-8 animate-in slide-up">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300',
                      currentStep > step.id
                        ? 'bg-sl-accent-primary text-white'
                        : currentStep === step.id
                        ? 'bg-sl-accent-primary/20 text-sl-accent-primary border-2 border-sl-accent-primary'
                        : 'bg-sl-bg-input text-sl-text-secondary/50 border-2 border-sl-border'
                    )}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className={cn('mt-2 text-xs text-center max-w-[70px]', currentStep >= step.id ? 'text-sl-text-primary font-medium' : 'text-sl-text-secondary')}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-1 mx-2 rounded-full',
                      currentStep > step.id
                        ? 'bg-sl-accent-primary'
                        : 'bg-sl-border'
                    )}
                  />
                )}
              </Fragment>
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-sl-text-secondary">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].description}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit as (data: FormData) => Promise<void>)} className="space-y-5" noValidate>
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 mt-4 border-t border-sl-border animate-in slide-up">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="btn-ghost"
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                Back
              </button>
            )}

            <div className="flex-1" />

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary"
                disabled={isSubmitting}
              >
                Continue
                <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
              </button>
            ) : (
              <PrimaryButton
                type="submit"
                loading={isSubmitting}
                className="w-full sm:w-auto"
              >
                Create Account
                <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
              </PrimaryButton>
            )}
          </div>
        </form>

        <p className="mt-8 text-center text-sl-text-secondary animate-in slide-up" style={{ animationDelay: '0.3s' }}>
          Already have an account?{' '}
          <Link to="/login" className="link-text">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}