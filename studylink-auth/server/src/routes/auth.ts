/**
 * Authentication Routes
 * Login, register, logout, password reset, session management
 */

import { Router } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { z } from 'zod'
import { asyncHandler } from '../middleware/errorHandler'
import { validateBody } from '../middleware/validation'
import { authenticate, generateTokens, verifyRefreshToken, requireAdmin } from '../middleware/auth'
import { ApiError } from '../middleware/errorHandler'
import prisma from '../config/database'
import { env } from '../config/env'

const router = Router()

// Validation schemas
const CSU_EMAIL_DOMAIN = '@carsu.edu.ph'
const CSU_EMAIL_ERROR = `Please use your official Caraga State University email address (${CSU_EMAIL_DOMAIN}) to register.`

const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .toLowerCase()
    .refine((email) => email.endsWith(CSU_EMAIL_DOMAIN), CSU_EMAIL_ERROR),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z
    .string()
    .email('Invalid email format')
    .toLowerCase()
    .refine((email) => email.endsWith(CSU_EMAIL_DOMAIN), CSU_EMAIL_ERROR),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  course: z.string().min(2, 'Course must be at least 2 characters').max(100),
  role: z.enum(['seeker', 'tutor', 'both']),
  // Student details (for seeker/both)
  yearLevel: z.string().optional().default(''),
  subjectsNeedHelp: z.string().optional().default(''),
  // Tutor details (for tutor/both)
  subjectsCanTutor: z.string().optional().default(''),
  expertiseLevels: z.object({
    beginner: z.boolean().default(false),
    intermediate: z.boolean().default(false),
    advanced: z.boolean().default(false),
  }).optional().default({ beginner: false, intermediate: false, advanced: false }),
  // Shared
  availability: z.object({
    morning: z.boolean().default(false),
    afternoon: z.boolean().default(false),
    evening: z.boolean().default(false),
  }).optional().default({ morning: false, afternoon: false, evening: false }),
  goal: z.string().optional().default(''),
  about: z.string().optional().default(''),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
// Conditional validation: tutor and both roles require tutor fields
.refine(
  (data) => {
    if (data.role === 'tutor' || data.role === 'both') {
      // At least one subject is required
      if (!data.subjectsCanTutor || data.subjectsCanTutor.trim() === '') return false
      // At least one availability slot is required
      if (!data.availability || (!data.availability.morning && !data.availability.afternoon && !data.availability.evening)) return false
    }
    return true
  },
  { message: 'Tutor role requires at least one subject and one availability slot', path: ['subjectsCanTutor'] }
)
// Conditional validation: seeker and both roles require student fields
.refine(
  (data) => {
    if (data.role === 'seeker' || data.role === 'both') {
      // Year level is required
      if (!data.yearLevel || data.yearLevel.trim() === '') return false
      // At least one subject is required
      if (!data.subjectsNeedHelp || data.subjectsNeedHelp.trim() === '') return false
      // At least one availability slot is required
      if (!data.availability || (!data.availability.morning && !data.availability.afternoon && !data.availability.evening)) return false
    }
    return true
  },
  { message: 'Student role requires year level, at least one subject, and one availability slot', path: ['subjectsNeedHelp'] }
)
// Duplicate validation: when role is both, student subjects and tutor subjects must not have duplicates
.refine(
  (data) => {
    if (data.role === 'both') {
      const studentSubjects = (data.subjectsNeedHelp || '')
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean)
      const tutorSubjects = (data.subjectsCanTutor || '')
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean)
      const duplicates = studentSubjects.filter(s => tutorSubjects.includes(s))
      return duplicates.length === 0
    }
    return true
  },
  { message: 'Subjects cannot appear in both "Subjects you need help with" and "Subjects you can tutor"', path: ['subjectsCanTutor'] }
)

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .toLowerCase()
    .refine((email) => email.endsWith(CSU_EMAIL_DOMAIN), CSU_EMAIL_ERROR),
})

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required').optional(),
})

/**
 * POST /api/auth/login
 * Authenticate user and return tokens
 */
router.post('/login', validateBody(loginSchema), asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      fullName: true,
      course: true,
      role: true,
      isVerified: true,
    },
  })

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password')
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.passwordHash)
  if (!isValidPassword) {
    throw ApiError.unauthorized('Invalid email or password')
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  })

  // Store refresh token in database
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 30 : 7))

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt,
    },
  })

  // Set HTTP-only cookies
  const cookieOptions = {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax' as const,
    maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000, // 30 days or 7 days
  }

  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes for access token
  })
  res.cookie('refreshToken', refreshToken, cookieOptions)

  // Return user data (without password)
  res.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      course: user.course,
      role: user.role,
      isVerified: user.isVerified,
    },
    accessToken, // Also return in body for frontend storage if needed
  })
}))

/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', validateBody(registerSchema), asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    password,
    course,
    role,
    yearLevel,
    subjectsNeedHelp,
    subjectsCanTutor,
    expertiseLevels,
    availability,
    goal,
    about,
  } = req.body

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw ApiError.conflict('An account with this email already exists')
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12)

  // Prepare tutor profile data if role is tutor or both
  const tutorProfileData = (role === 'tutor' || role === 'both') ? {
    subjects: subjectsCanTutor ? subjectsCanTutor.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    expertise: expertiseLevels ? Object.entries(expertiseLevels).find(([, v]) => v)?.[0] || 'intermediate' : 'intermediate',
    expertiseLevels: expertiseLevels || { beginner: false, intermediate: false, advanced: false },
    availability: availability || { morning: false, afternoon: false, evening: false },
    about: about || '',
    isActive: true,
  } : null

  // Prepare student profile data if role is seeker or both (stored in user metadata or separate table if needed)
  // For now, we'll store student preferences in user metadata or can add a StudentProfile model later

  // Create user with conditional tutor profile
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      course,
      role,
      // Store student preferences in user metadata
      ...((role === 'seeker' || role === 'both') && {
        yearLevel: yearLevel || '',
        subjectsNeedHelp: subjectsNeedHelp || '',
        goal: goal || '',
        availability: availability || { morning: false, afternoon: false, evening: false },
      }),
      // Create tutor profile if role is tutor or both
      ...(tutorProfileData && {
        tutorProfile: {
          create: tutorProfileData,
        },
      }),
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      course: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  })

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  })

  // Store refresh token
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt,
    },
  })

  // Set cookies
  const cookieOptions = {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  }

  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  })
  res.cookie('refreshToken', refreshToken, cookieOptions)

  res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      course: user.course,
      role: user.role,
      isVerified: user.isVerified,
    },
    accessToken,
    message: 'Account created successfully',
  })
}))

/**
 * POST /api/auth/logout
 * Logout user and revoke refresh token
 */
router.post('/logout', asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken

  if (refreshToken) {
    // Revoke refresh token in database
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true },
    })
  }

  // Clear cookies
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
  })
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
  })

  res.json({ message: 'Logged out successfully' })
}))

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token from HTTP-only cookie
 */
router.post('/refresh', validateBody(refreshTokenSchema), asyncHandler(async (req, res) => {
  // Read refresh token from HTTP-only cookie (more secure - JS cannot access)
  const refreshToken = req.cookies?.refreshToken

  if (!refreshToken) {
    throw ApiError.unauthorized('Refresh token not found')
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken)
  if (!decoded) {
    throw ApiError.unauthorized('Invalid refresh token')
  }

  // Check if token exists in database and is not revoked
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  })

  if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
    throw ApiError.unauthorized('Refresh token expired or revoked')
  }

  // Get user
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, role: true },
  })

  if (!user) {
    throw ApiError.unauthorized('User not found')
  }

  // Generate new tokens
  const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  })

  // Revoke old refresh token and create new one
  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revoked: true },
  })

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: newRefreshToken,
      expiresAt,
    },
  })

  // Set new cookies
  const cookieOptions = {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }

  res.cookie('accessToken', newAccessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  })
  res.cookie('refreshToken', newRefreshToken, cookieOptions)

  res.json({ accessToken: newAccessToken })
}))

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      fullName: true,
      course: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    throw ApiError.notFound('User not found')
  }

  res.json({ user })
}))

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 */
router.post('/forgot-password', validateBody(forgotPasswordSchema), asyncHandler(async (req, res) => {
  const { email } = req.body

  // Find user (but don't reveal if exists)
  const user = await prisma.user.findUnique({
    where: { email },
  })

  // Always return success to prevent email enumeration
  if (!user) {
    return res.json({
      message: 'If an account exists with that email, you will receive a password reset link shortly.',
    })
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex')
  const hashedToken = await bcrypt.hash(resetToken, 12)

  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 1) // 1 hour expiry

  // Store reset token
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expiresAt,
    },
  })

  // TODO: Send email with reset link
  // const resetUrl = `${env.frontendUrl}/reset-password?token=${resetToken}`
  // await sendPasswordResetEmail(user.email, resetUrl)

  // For development, log the token
  if (env.nodeEnv === 'development') {
    console.log(`🔑 Password reset token for ${email}: ${resetToken}`)
  }

  res.json({
    message: 'If an account exists with that email, you will receive a password reset link shortly.',
  })
}))

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post('/reset-password', validateBody(resetPasswordSchema), asyncHandler(async (req, res) => {
  const { token, password } = req.body

  // Find valid reset token
  const resetTokens = await prisma.passwordResetToken.findMany({
    where: {
      expiresAt: { gt: new Date() },
      used: false,
    },
    include: { user: true },
  })

  let validToken = null
  for (const rt of resetTokens) {
    const isValid = await bcrypt.compare(token, rt.token)
    if (isValid) {
      validToken = rt
      break
    }
  }

  if (!validToken) {
    throw ApiError.badRequest('Invalid or expired reset token')
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(password, 12)

  // Update user password
  await prisma.user.update({
    where: { id: validToken.userId },
    data: { passwordHash },
  })

  // Mark token as used
  await prisma.passwordResetToken.update({
    where: { id: validToken.id },
    data: { used: true },
  })

  // Revoke all refresh tokens for this user (force re-login)
  await prisma.refreshToken.updateMany({
    where: { userId: validToken.userId },
    data: { revoked: true },
  })

  res.json({ message: 'Password reset successfully. Please log in with your new password.' })
}))

/**
 * POST /api/auth/revoke-sessions
 * Revoke all user sessions (requires authentication)
 */
router.post('/revoke-sessions', authenticate, asyncHandler(async (req, res) => {
  await prisma.refreshToken.updateMany({
    where: { userId: req.user!.id },
    data: { revoked: true },
  })

  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
  })
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
  })

  res.json({ message: 'All sessions revoked successfully' })
}))

export { router as authRoutes }