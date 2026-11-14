import { z } from 'zod'
import { MIN_PASSWORD_LENGTH, PASSWORD_REQUIREMENTS, UserRole } from '@/types/auth'

// Helper to validate subject arrays (at least one subject)
const subjectArraySchema = z.array(z.string()).min(1, 'Please select at least one subject')

// Helper to validate expertise levels (at least one for tutor)
const expertiseLevelsSchema = z.object({
  beginner: z.boolean().default(false),
  intermediate: z.boolean().default(false),
  advanced: z.boolean().default(false),
}).refine(
  (data) => data.beginner || data.intermediate || data.advanced,
  { message: 'Please select at least one expertise level', path: ['expertiseLevels'] }
)

// Helper to validate availability (at least one slot)
const availabilitySchema = z.object({
  morning: z.boolean().default(false),
  afternoon: z.boolean().default(false),
  evening: z.boolean().default(false),
}).refine(
  (data) => data.morning || data.afternoon || data.evening,
  { message: 'Please select at least one availability slot', path: ['availability'] }
)

const CSU_EMAIL_DOMAIN = '@carsu.edu.ph'
const CSU_EMAIL_ERROR = `Please use your official Caraga State University email address (${CSU_EMAIL_DOMAIN}) to register.`

/**
 * Zod schema for login form validation
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .refine(
      (email) => email.toLowerCase().endsWith(CSU_EMAIL_DOMAIN),
      CSU_EMAIL_ERROR
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
      (email) => email.toLowerCase().endsWith(CSU_EMAIL_DOMAIN),
      CSU_EMAIL_ERROR
    ),
  course: z
    .string()
    .min(1, 'Course/Program is required')
    .min(2, 'Course must be at least 2 characters')
    .max(100, 'Course must be less than 100 characters'),
})

export type RegisterStep1Data = z.infer<typeof registerStep1Schema>

/**
 * Zod schema for registration form validation (step 2 - role selection)
 */
export const roleSelectionSchema = z.object({
  role: z.enum<[UserRole, ...UserRole[]]>(['seeker', 'tutor', 'both'], {
    message: 'Please select an account role',
  }),
})

export type RoleSelectionData = z.infer<typeof roleSelectionSchema>

/**
 * Student Details schema (Step 3 for seeker and both roles)
 */
export const studentDetailsSchema = z.object({
  yearLevel: z.string().min(1, 'Year level is required'),
  college: z.string().optional(),
  subjectsNeedHelp: subjectArraySchema,
  studentAvailability: availabilitySchema,
  goal: z.string().optional(),
})

export type StudentDetailsData = z.infer<typeof studentDetailsSchema>

/**
 * Tutor Details schema (Step 3 for tutor and both roles)
 */
export const tutorDetailsSchema = z.object({
  college: z.string().optional(),
  subjectsCanTutor: subjectArraySchema,
  expertiseLevels: expertiseLevelsSchema,
  tutorAvailability: availabilitySchema,
  about: z.string().optional(),
})

export type TutorDetailsData = z.infer<typeof tutorDetailsSchema>

/**
 * Zod schema for registration form validation (step 4 - security)
 */
export const registerStep4Schema = z.object({
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

export type RegisterStep4Data = z.infer<typeof registerStep4Schema>

/**
 * Complete registration schema (all steps combined)
 */
export const registerSchema = registerStep1Schema
  .extend(roleSelectionSchema.shape)
  .extend(studentDetailsSchema.shape)
  .extend(tutorDetailsSchema.shape)
  .extend(registerStep4Schema.shape)
  // Add college field (shared between student and tutor)
  .extend({
    college: z.string().optional(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    { message: 'Passwords do not match', path: ['confirmPassword'] }
  )
  // Conditional validation: tutor and both roles require tutor fields
  .refine(
    (data) => {
      if (data.role === 'tutor' || data.role === 'both') {
        // At least one subject is required (array check)
        if (!data.subjectsCanTutor || data.subjectsCanTutor.length === 0) return false
        // At least one availability slot is required
        if (!data.tutorAvailability || (!data.tutorAvailability.morning && !data.tutorAvailability.afternoon && !data.tutorAvailability.evening)) return false
      }
      return true
    },
    { message: 'Tutor role requires at least one subject and one availability slot', path: ['subjectsCanTutor'] }
  )
  // Conditional validation: seeker and both roles require student fields
  .refine(
    (data) => {
      if (data.role === 'seeker' || data.role === 'both') {
        // At least one subject is required (array check)
        if (!data.subjectsNeedHelp || data.subjectsNeedHelp.length === 0) return false
        // Year level is required
        if (!data.yearLevel || data.yearLevel.trim() === '') return false
        // At least one availability slot is required
        if (!data.studentAvailability || (!data.studentAvailability.morning && !data.studentAvailability.afternoon && !data.studentAvailability.evening)) return false
      }
      return true
    },
    { message: 'Student role requires year level, at least one subject, and one availability slot', path: ['subjectsNeedHelp'] }
  )
  // Duplicate validation: when role is both, student subjects and tutor subjects must not have duplicates
  .refine(
    (data) => {
      if (data.role === 'both') {
        const studentSubjects = (data.subjectsNeedHelp || [])
          .map(s => s.trim().toLowerCase())
          .filter(Boolean)
        const tutorSubjects = (data.subjectsCanTutor || [])
          .map(s => s.trim().toLowerCase())
          .filter(Boolean)
        const duplicates = studentSubjects.filter(s => tutorSubjects.includes(s))
        return duplicates.length === 0
      }
      return true
    },
    { message: 'Subjects cannot appear in both "Subjects you need help with" and "Subjects you can tutor"', path: ['subjectsCanTutor'] }
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
      (email) => email.toLowerCase().endsWith(CSU_EMAIL_DOMAIN),
      CSU_EMAIL_ERROR
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