/**
 * Authentication Service
 * Handles all authentication-related API calls
 *
 * BACKEND INTEGRATION POINTS:
 * - login() → POST /api/auth/login
 * - register() → POST /api/auth/register
 * - logout() → POST /api/auth/logout
 * - forgotPassword() → POST /api/auth/forgot-password
 * - resetPassword() → POST /api/auth/reset-password
 * - getCurrentUser() → GET /api/auth/me
 * - refreshToken() → POST /api/auth/refresh
 */

import { api, ApiError } from './api'
import type { User, LoginCredentials, ForgotPasswordData, ResetPasswordData, UserRole } from '@/types/auth'

interface LoginResponse {
  user: User
  accessToken: string
}

interface RegisterResponse {
  user: User
  accessToken: string
  message: string
}

interface ForgotPasswordResponse {
  message: string
}

interface ResetPasswordResponse {
  message: string
}

interface MeResponse {
  user: User
}

/**
 * Login user with email and password
 * POST /api/auth/login
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
      rememberMe: credentials.rememberMe ?? false,
    })
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message)
    }
    throw new Error('An unexpected error occurred. Please try again.')
  }
}

/**
 * Register new user
 * POST /api/auth/register
 */
interface RegisterRequest {
  fullName: string
  email: string
  password: string
  course: string
  role: UserRole
}

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  try {
    const response = await api.post<RegisterResponse>('/auth/register', {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      course: data.course,
      role: data.role,
    })
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle validation errors
      if (error.errors) {
        const messages = Object.values(error.errors).flat()
        throw new Error(messages.join(', '))
      }
      throw new Error(error.message)
    }
    throw new Error('An unexpected error occurred. Please try again.')
  }
}

/**
 * Logout current user
 * POST /api/auth/logout
 */
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout', {})
  } catch (error) {
    // Even if logout fails on server, we should clear local state
    console.error('Logout error:', error)
  }
}

/**
 * Request password reset email
 * POST /api/auth/forgot-password
 */
export async function forgotPassword(data: ForgotPasswordData): Promise<ForgotPasswordResponse> {
  try {
    const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password', {
      email: data.email,
    })
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message)
    }
    throw new Error('An unexpected error occurred. Please try again.')
  }
}

/**
 * Reset password with token
 * POST /api/auth/reset-password
 */
export async function resetPassword(data: ResetPasswordData): Promise<ResetPasswordResponse> {
  try {
    const response = await api.post<ResetPasswordResponse>('/auth/reset-password', {
      token: data.token,
      password: data.password,
      confirmPassword: data.confirmPassword,
    })
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.errors) {
        const messages = Object.values(error.errors).flat()
        throw new Error(messages.join(', '))
      }
      throw new Error(error.message)
    }
    throw new Error('An unexpected error occurred. Please try again.')
  }
}

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await api.get<MeResponse>('/auth/me')
    return response.user
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      throw new Error('UNAUTHENTICATED')
    }
    throw error
  }
}

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export async function refreshToken(): Promise<{ accessToken: string }> {
  try {
    const response = await api.post<{ accessToken: string }>('/auth/refresh', {})
    return response
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      throw new Error('UNAUTHENTICATED')
    }
    throw error
  }
}

/**
 * Update user profile
 * PATCH /api/auth/profile
 */
export async function updateProfile(data: Partial<User>): Promise<User> {
  try {
    const response = await api.patch<{ user: User }>('/auth/profile', data)
    return response.user
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.errors) {
        const messages = Object.values(error.errors).flat()
        throw new Error(messages.join(', '))
      }
      throw new Error(error.message)
    }
    throw new Error('An unexpected error occurred. Please try again.')
  }
}