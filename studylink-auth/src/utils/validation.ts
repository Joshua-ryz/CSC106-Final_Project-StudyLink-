import { z } from 'zod'
import { MIN_PASSWORD_LENGTH, PASSWORD_REQUIREMENTS } from '@/types/auth'

/**
 * Zod schema for login form validation
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .refine(
      (email) => email.toLowerCase().endsWith('@csu.edu.ph'),
      'Please use your CSU email address (@csu.edu.ph)'
    ),
  password: z
    .string()
    .min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>

/**
 * Zod schema for registration form validation (step 1 - personal info)
 */
export const registerStep1Schema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .refine(
      (email) => email.toLowerCase().endsWith('@csu.edu.ph'),
      'Please use your CSU email address (@csu.edu.ph)'
    ),
  course: z
    .string()
    .min(1, 'Course/Program is required')
    .min(2, 'Course must be at least 2 characters')
    .max(100, 'Course must be less than 100 characters'),
})

export type RegisterStep1Data = z.infer<typeof registerStep1Schema>

/**
 * Zod schema for registration form validation (step 2 - password)
 */
export const registerStep2Schema = z.object({
  password: z
    .string()
    .min(1, 'Password is required')
    .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type RegisterStep2Data = z.infer<typeof registerStep2Schema>

/**
 * Zod schema for role selection
 */
type RoleValue = 'tutee' | 'tutor' | 'both'

export const roleSelectionSchema = z.object({
  role: z.enum<[RoleValue, ...RoleValue[]]>(['tutee', 'tutor', 'both'], {
    message: 'Please select an account role',
  }),
})

export type RoleSelectionData = z.infer<typeof roleSelectionSchema>

/**
 * Complete registration schema (all steps combined)
 * Using safeExtend to combine schemas with refinements (Zod v4 compatible)
 */
export const registerSchema = registerStep1Schema.extend(registerStep2Schema.shape).extend(roleSelectionSchema.shape).refine(
  (data) => data.password === data.confirmPassword,
  { message: 'Passwords do not match', path: ['confirmPassword'] }
)

export type RegisterFormData = z.infer<typeof registerSchema>

/**
 * Zod schema for forgot password form
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .refine(
      (email) => email.toLowerCase().endsWith('@csu.edu.ph'),
      'Please use your CSU email address (@csu.edu.ph)'
    ),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

/**
 * Zod schema for reset password form
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Invalid reset token'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

/**
 * Password requirements - re-exported for components that need them
 */
export { PASSWORD_REQUIREMENTS }

/**
 * Type for a single password requirement
 */
export type PasswordRequirement = typeof PASSWORD_REQUIREMENTS[number]

/**
 * Password strength checker
 */
export function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
  passedRequirements: string[]
  failedRequirements: string[]
} {
  const passed = PASSWORD_REQUIREMENTS.filter((req) => req.test(password)).map((r) => r.label)
  const failed = PASSWORD_REQUIREMENTS.filter((req) => !req.test(password)).map((r) => r.label)
  const score = passed.length

  const levels = [
    { label: 'Very Weak', color: 'text-sl-error' },
    { label: 'Weak', color: 'text-sl-error' },
    { label: 'Fair', color: 'text-yellow-500' },
    { label: 'Good', color: 'text-sl-accent-secondary' },
    { label: 'Strong', color: 'text-sl-success' },
  ]

  return {
    score,
    label: levels[Math.min(score, levels.length - 1)].label,
    color: levels[Math.min(score, levels.length - 1)].color,
    passedRequirements: passed,
    failedRequirements: failed,
  }
}

/**
 * Format Zod error for display
 */
export function formatZodError<T>(error: z.ZodError<T>): Record<string, string> {
  const formatted: Record<string, string> = {}
  error.issues.forEach((issue) => {
    const path = issue.path.join('.')
    if (!formatted[path]) {
      formatted[path] = issue.message
    }
  })
  return formatted
}

/**
 * Get first error message from Zod error
 */
export function getFirstZodError<T>(error: z.ZodError<T>): string {
  return error.issues[0]?.message || 'Validation failed'
}