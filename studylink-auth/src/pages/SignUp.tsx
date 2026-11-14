/**
 * SignUp Page
 * Multi-step registration: Personal Info → Role → Details → Security
 * NFR-004 NFR-005 NFR-011 references
 */

import { useState, useEffect, Fragment, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Mail,
  User,
  GraduationCap,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Calendar,
  UserCheck,
} from 'lucide-react'
import {
  registerSchema,
  type RegisterFormData,
  getPasswordStrength,
  PASSWORD_REQUIREMENTS,
} from '@/utils/validation'
import { register as registerUser } from '@/services/authService'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/toaster'
import {
  AuthLayout,
  InputField,
  RoleSelector,
  PrimaryButton,
  SubjectSelector,
  YearLevelSelect,
  AvailabilityPicker,
  ExpertiseSelector,
  CollegeSelector,
  Button,
} from '@/components'
import { cn } from '@/utils'

type FormData = RegisterFormData

const steps = [
  { id: 1, title: 'Personal Info', description: 'Tell us about yourself' },
  { id: 2, title: 'Role', description: 'How will you use StudyLink?' },
  { id: 3, title: 'Details', description: 'Share your preferences' },
  { id: 4, title: 'Security', description: 'Secure your account' },
]

function getStrengthBgColor(textColor: string): string {
  const colorMap: Record<string, string> = {
    'text-sl-error': 'var(--color-sl-error)',
    'text-yellow-500': 'var(--color-sl-warning)',
    'text-sl-accent-secondary': 'var(--color-sl-accent-secondary)',
    'text-sl-success': 'var(--color-sl-success)',
  }
  return colorMap[textColor] || 'var(--color-sl-accent-primary)'
}

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

  // Ref for the form panel to handle scrolling to errors
  const formPanelRef = useRef<HTMLDivElement>(null)

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
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      fullName: '',
      email: '',
      course: '',
      password: '',
      confirmPassword: '',
      role: undefined,
      yearLevel: '',
      college: '',
      subjectsNeedHelp: [] as string[],
      subjectsCanTutor: [] as string[],
      expertiseLevels: { beginner: false, intermediate: false, advanced: false },
      studentAvailability: { morning: false, afternoon: false, evening: false },
      tutorAvailability: { morning: false, afternoon: false, evening: false },
      goal: '',
      about: '',
    },
    mode: 'onChange',
  })

  const watchedPassword = watch('password')
  const watchedRole = watch('role')
  const watchedStudentAvailability = watch('studentAvailability')
  const watchedTutorAvailability = watch('tutorAvailability')
  const watchedExpertiseLevels = watch('expertiseLevels')
  const watchedSubjectsNeedHelp = watch('subjectsNeedHelp')
  const watchedSubjectsCanTutor = watch('subjectsCanTutor')
  const watchedCollege = watch('college')
  const watchedYearLevel = watch('yearLevel')

  // Update password strength when password changes
  useEffect(() => {
    if (watchedPassword) {
      setPasswordStrength(getPasswordStrength(watchedPassword))
    } else {
      setPasswordStrength({ score: 0, label: '', color: '', passedRequirements: [], failedRequirements: [] })
    }
  }, [watchedPassword])

  const getNextStep = () => {
    if (currentStep < steps.length) {
      return currentStep + 1
    }
    return currentStep
  }

  const getPrevStep = () => {
    if (currentStep > 1) {
      return currentStep - 1
    }
    return currentStep
  }

  // Scroll to first error in the form panel
  const scrollToError = useCallback((errorPath: string) => {
    if (formPanelRef.current) {
      const errorElement = formPanelRef.current.querySelector(`[data-error-path="${errorPath}"]`)
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Add a temporary highlight
        errorElement.classList.add('ring-2', 'ring-sl-error', 'ring-offset-2', 'ring-offset-sl-bg-main')
        setTimeout(() => {
          errorElement.classList.remove('ring-2', 'ring-sl-error', 'ring-offset-2', 'ring-offset-sl-bg-main')
        }, 3000)
      }
    }
  }, [])

  const nextStep = async () => {
    let fieldsToValidate: Array<keyof FormData> = []

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['fullName', 'email', 'course']
        break
      case 2:
        fieldsToValidate = ['role']
        break
      case 3:
        if (watchedRole === 'seeker') {
          fieldsToValidate = ['yearLevel', 'subjectsNeedHelp', 'studentAvailability']
        } else if (watchedRole === 'tutor') {
          fieldsToValidate = ['subjectsCanTutor', 'expertiseLevels', 'tutorAvailability']
        } else if (watchedRole === 'both') {
          fieldsToValidate = ['yearLevel', 'subjectsNeedHelp', 'studentAvailability', 'subjectsCanTutor', 'expertiseLevels', 'tutorAvailability']
        }
        break
      case 4:
        fieldsToValidate = ['password', 'confirmPassword']
        break
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid && currentStep < steps.length) {
      setCurrentStep(getNextStep())
    } else if (!isValid) {
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0] as keyof FormData
      if (firstErrorKey) {
        scrollToError(firstErrorKey as string)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(getPrevStep())
    }
  }

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    setLoading(true)
    clearErrors()

    try {
      // NOTE: College field is not yet supported by the backend API.
      // It is collected in the form for future use but not sent to the backend.

      // Combine student and tutor availability for the backend (OR merge)
      const studentAvail = data.studentAvailability || { morning: false, afternoon: false, evening: false }
      const tutorAvail = data.tutorAvailability || { morning: false, afternoon: false, evening: false }
      const combinedAvailability = {
        morning: studentAvail.morning || tutorAvail.morning,
        afternoon: studentAvail.afternoon || tutorAvail.afternoon,
        evening: studentAvail.evening || tutorAvail.evening,
      }

      const response = await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        course: data.course,
        role: data.role,
        yearLevel: data.yearLevel,
        subjectsNeedHelp: data.subjectsNeedHelp.join(', '),
        subjectsCanTutor: data.subjectsCanTutor.join(', '),
        expertiseLevels: data.expertiseLevels,
        availability: combinedAvailability,
        goal: data.goal,
        about: data.about,
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
      <InputField
        label="Full Name"
        type="text"
        placeholder="Juan Dela Cruz"
        error={errors.fullName?.message}
        leftIcon={<User className="w-5 h-5" />}
        autoComplete="name"
        id="fullName"
        {...register('fullName')}
      />

      <InputField
        label="CSU Email Address"
        type="email"
        placeholder="student@carsu.edu.ph"
        error={errors.email?.message}
        leftIcon={<Mail className="w-5 h-5" />}
        autoComplete="email"
        id="email"
        {...register('email')}
      />

      <InputField
        label="Course / Program"
        type="text"
        placeholder="e.g., BS Computer Science"
        error={errors.course?.message}
        leftIcon={<GraduationCap className="w-5 h-5" />}
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

  const renderStep3 = () => {
    const isSeeker = watchedRole === 'seeker'
    const isTutor = watchedRole === 'tutor'
    const isBoth = watchedRole === 'both'

    const subtitle = isSeeker
      ? 'Help us match you with the right tutors'
      : isTutor
      ? 'Help students find you by sharing your expertise'
      : 'Tell us about both your learning needs and tutoring expertise'

    // College is shared between student and tutor in "both" mode
    const showCollege = isSeeker || isTutor || isBoth

    return (
      <div className="space-y-6 animate-in slide-up" ref={formPanelRef}>
        <p className="text-sm text-sl-text-secondary mb-2">{subtitle}</p>

        {/* College / Academic Affiliation - shown for all roles */}
        {showCollege && (
          <div className="space-y-2" data-error-path="college">
            <CollegeSelector
              label="College / Academic Affiliation"
              value={watchedCollege || ''}
              onChange={(val) => setValue('college', val, { shouldValidate: true })}
              error={errors.college?.message}
              placeholder="Select your college"
              leftIcon={<GraduationCap className="w-5 h-5" />}
              id="college"
            />
            <p className="text-xs text-sl-text-muted">
              Select the CSU college you are currently affiliated with.
            </p>
          </div>
        )}

        {/* Student Details Section - shown for seeker and both */}
        {(isSeeker || isBoth) && (
          <fieldset className="space-y-6 p-6 bg-sl-bg-input/30 border border-sl-border/50 rounded-xl" data-error-path="subjectsNeedHelp">
            <legend className="flex items-center gap-2 text-base font-semibold text-sl-text-primary">
              <GraduationCap className="w-5 h-5 text-sl-accent-primary" aria-hidden="true" />
              Student Details
            </legend>

            <YearLevelSelect
              label="Year Level"
              value={watchedYearLevel || ''}
              onChange={(val) => setValue('yearLevel', val, { shouldValidate: true })}
              error={errors.yearLevel?.message}
              leftIcon={<Calendar className="w-5 h-5" />}
              id="yearLevel"
            />

            <SubjectSelector
              value={watchedSubjectsNeedHelp || []}
              onChange={(selected) => setValue('subjectsNeedHelp', selected, { shouldValidate: true })}
              disabledSubjects={watchedSubjectsCanTutor || []}
              context="student"
              error={errors.subjectsNeedHelp?.message}
              ariaLabel="Select subjects you need help with"
            />

            <AvailabilityPicker
              label="Availability"
              value={watchedStudentAvailability}
              onChange={(avail) => setValue('studentAvailability', avail, { shouldValidate: true })}
              error={errors.studentAvailability?.message}
              helperText="Select when you're available for tutoring sessions"
              ariaLabel="Select your available time slots as a student"
            />

            <div className="space-y-2" data-error-path="goal">
              <label className="block mb-2 text-sm font-medium text-sl-text-primary">
                Learning Goal (Optional)
              </label>
              <textarea
                {...register('goal')}
                placeholder="e.g., Improve my grades in Calculus, Prepare for final exams"
                className={cn(
                  'input-field min-h-[100px] resize-y',
                  errors.goal && 'border-sl-error focus:border-sl-error focus:ring-sl-error/20'
                )}
                rows={3}
                id="goal"
                aria-describedby={errors.goal ? 'goal-error' : undefined}
              />
              {errors.goal && (
                <p id="goal-error" className="text-sm text-sl-error flex items-center gap-1" role="alert">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.goal.message}
                </p>
              )}
            </div>
          </fieldset>
        )}

        {/* Tutor Details Section - shown for tutor and both */}
        {(isTutor || isBoth) && (
          <fieldset className="space-y-6 p-6 bg-sl-bg-input/30 border border-sl-border/50 rounded-xl" data-error-path="subjectsCanTutor">
            <legend className="flex items-center gap-2 text-base font-semibold text-sl-text-primary">
              <UserCheck className="w-5 h-5 text-sl-accent-secondary" aria-hidden="true" />
              Tutor Details
            </legend>

            <SubjectSelector
              value={watchedSubjectsCanTutor || []}
              onChange={(selected) => setValue('subjectsCanTutor', selected, { shouldValidate: true })}
              disabledSubjects={watchedSubjectsNeedHelp || []}
              context="tutor"
              error={errors.subjectsCanTutor?.message}
              ariaLabel="Select subjects you can tutor"
            />

            <ExpertiseSelector
              value={watchedExpertiseLevels}
              onChange={(expertise) => setValue('expertiseLevels', expertise, { shouldValidate: true })}
              error={errors.expertiseLevels?.message}
              ariaLabel="Select your expertise levels"
            />

            <AvailabilityPicker
              label="Tutor Availability"
              value={watchedTutorAvailability}
              onChange={(avail) => setValue('tutorAvailability', avail, { shouldValidate: true })}
              error={errors.tutorAvailability?.message}
              helperText="Select when you're available for tutoring sessions"
              ariaLabel="Select your available time slots as a tutor"
            />

            <div className="space-y-2" data-error-path="about">
              <label className="block mb-2 text-sm font-medium text-sl-text-primary">
                About You (Optional)
              </label>
              <textarea
                {...register('about')}
                placeholder="e.g., Dean's Lister, 3.8 GPA, Teaching Assistant for CS101, 2 years tutoring experience"
                className={cn(
                  'input-field min-h-[100px] resize-y',
                  errors.about && 'border-sl-error focus:border-sl-error focus:ring-sl-error/20'
                )}
                rows={3}
                id="about"
                aria-describedby={errors.about ? 'about-error' : undefined}
              />
              {errors.about && (
                <p id="about-error" className="text-sm text-sl-error flex items-center gap-1" role="alert">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.about.message}
                </p>
              )}
            </div>
          </fieldset>
        )}
      </div>
    )
  }

  const renderStep4 = () => (
    <div className="space-y-5 animate-in slide-up">
      <InputField
        label="Password"
        type="password"
        placeholder="Create a strong password"
        error={errors.password?.message}
        leftIcon={<Lock className="w-5 h-5" />}
        showPasswordToggle
        autoComplete="new-password"
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
                style={{ color: passwordStrength.passedRequirements.includes(req.label) ? 'var(--color-sl-success)' : 'var(--color-sl-text-secondary)' }}
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

      <InputField
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        error={errors.confirmPassword?.message}
        leftIcon={<Lock className="w-5 h-5" />}
        showPasswordToggle
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
      case 4:
        return renderStep4()
      default:
        return null
    }
  }

  return (
    <AuthLayout>
      <div className="card-auth w-full max-w-xl">
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
                  <span className={cn('mt-2 text-xs text-center max-w-[80px]', currentStep >= step.id ? 'text-sl-text-primary font-medium' : 'text-sl-text-secondary')}>
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {renderStepContent()}

          {/* Navigation Buttons - Sticky Footer */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-sl-border animate-in slide-up sticky bottom-0 bg-sl-bg-card pb-4 z-10" style={{ marginBottom: '-1.5rem', marginLeft: '-2rem', marginRight: '-2rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
            {currentStep > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={prevStep}
                disabled={isSubmitting}
                iconLeft={<ArrowLeft className="w-4 h-4" aria-hidden="true" />}
              >
                Back
              </Button>
            )}

            <div className="flex-1"></div>

            {currentStep < steps.length ? (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={nextStep}
                disabled={isSubmitting}
                iconRight={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
              >
                Continue
              </Button>
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