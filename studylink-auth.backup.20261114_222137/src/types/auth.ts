/**
 * Authentication Types
 * Centralized type definitions for the authentication system
 */

export type UserRole = 'tutee' | 'tutor' | 'both';

export interface User {
  id: string;
  email: string;
  fullName: string;
  course: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  course: string;
  role: UserRole;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Role display information
export const ROLE_INFO: Record<UserRole, { title: string; description: string; icon: string }> = {
  tutee: {
    title: 'I need tutoring',
    description: 'Find fellow CSU students who can help me understand academic subjects.',
    icon: 'graduation-cap',
  },
  tutor: {
    title: 'I want to be a tutor',
    description: 'Share my knowledge and help fellow CSU students with their studies.',
    icon: 'user-check',
  },
  both: {
    title: 'Both',
    description: 'I want to find tutors and also provide tutoring services.',
    icon: 'users',
  },
};

export const ROLE_OPTIONS = [
  { value: 'tutee' as UserRole, label: 'I need tutoring', description: 'Find fellow CSU students who can help me understand academic subjects.' },
  { value: 'tutor' as UserRole, label: 'I want to be a tutor', description: 'Share my knowledge and help fellow CSU students with their studies.' },
  { value: 'both' as UserRole, label: 'Both', description: 'I want to find tutors and also provide tutoring services.' },
];

// Password requirements
export const PASSWORD_REQUIREMENTS = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
] as const;

export const MIN_PASSWORD_LENGTH = 8;