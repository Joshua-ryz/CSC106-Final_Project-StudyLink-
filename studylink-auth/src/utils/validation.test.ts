/**
 * Validation Utility Tests
 */

import { describe, it, expect } from 'vitest'
import {
  loginSchema,
  registerStep1Schema,
  registerStep2Schema,
  roleSelectionSchema,
  forgotPasswordSchema,
  getPasswordStrength,
  PASSWORD_REQUIREMENTS,
} from './validation'

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('validates correct email and password', () => {
      const result = loginSchema.safeParse({
        email: 'student@csu.edu.ph',
        password: 'password123',
        rememberMe: true,
      })
      expect(result.success).toBe(true)
    })

    it('rejects non-CSU email', () => {
      const result = loginSchema.safeParse({
        email: 'student@gmail.com',
        password: 'password123',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((result.error as any).issues[0].message).toContain('CSU')
      }
    })

    it('rejects empty email', () => {
      const result = loginSchema.safeParse({
        email: '',
        password: 'password123',
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty password', () => {
      const result = loginSchema.safeParse({
        email: 'student@csu.edu.ph',
        password: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid email format', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('registerStep1Schema', () => {
    it('validates correct personal info', () => {
      const result = registerStep1Schema.safeParse({
        fullName: 'Juan Dela Cruz',
        email: 'student@csu.edu.ph',
        course: 'BS Computer Science',
      })
      expect(result.success).toBe(true)
    })

    it('rejects short name', () => {
      const result = registerStep1Schema.safeParse({
        fullName: 'J',
        email: 'student@csu.edu.ph',
        course: 'BS Computer Science',
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid name characters', () => {
      const result = registerStep1Schema.safeParse({
        fullName: 'Juan123',
        email: 'student@csu.edu.ph',
        course: 'BS Computer Science',
      })
      expect(result.success).toBe(false)
    })

    it('rejects non-CSU email', () => {
      const result = registerStep1Schema.safeParse({
        fullName: 'Juan Dela Cruz',
        email: 'student@gmail.com',
        course: 'BS Computer Science',
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty course', () => {
      const result = registerStep1Schema.safeParse({
        fullName: 'Juan Dela Cruz',
        email: 'student@csu.edu.ph',
        course: '',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('registerStep2Schema', () => {
    it('validates matching passwords with requirements', () => {
      const result = registerStep2Schema.safeParse({
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      })
      expect(result.success).toBe(true)
    })

    it('rejects mismatched passwords', () => {
      const result = registerStep2Schema.safeParse({
        password: 'SecurePass123!',
        confirmPassword: 'DifferentPass123!',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((result.error as any).issues[0].path).toContain('confirmPassword')
      }
    })

    it('rejects password too short', () => {
      const result = registerStep2Schema.safeParse({
        password: 'Pass1!',
        confirmPassword: 'Pass1!',
      })
      expect(result.success).toBe(false)
    })

    it('rejects password without uppercase', () => {
      const result = registerStep2Schema.safeParse({
        password: 'securepass123!',
        confirmPassword: 'securepass123!',
      })
      expect(result.success).toBe(false)
    })

    it('rejects password without lowercase', () => {
      const result = registerStep2Schema.safeParse({
        password: 'SECUREPASS123!',
        confirmPassword: 'SECUREPASS123!',
      })
      expect(result.success).toBe(false)
    })

    it('rejects password without number', () => {
      const result = registerStep2Schema.safeParse({
        password: 'SecurePass!',
        confirmPassword: 'SecurePass!',
      })
      expect(result.success).toBe(false)
    })

    it('rejects password without special character', () => {
      const result = registerStep2Schema.safeParse({
        password: 'SecurePass123',
        confirmPassword: 'SecurePass123',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('roleSelectionSchema', () => {
    it('accepts tutee role', () => {
      const result = roleSelectionSchema.safeParse({ role: 'tutee' })
      expect(result.success).toBe(true)
    })

    it('accepts tutor role', () => {
      const result = roleSelectionSchema.safeParse({ role: 'tutor' })
      expect(result.success).toBe(true)
    })

    it('accepts both role', () => {
      const result = roleSelectionSchema.safeParse({ role: 'both' })
      expect(result.success).toBe(true)
    })

    it('rejects invalid role', () => {
      const result = roleSelectionSchema.safeParse({ role: 'admin' })
      expect(result.success).toBe(false)
    })

    it('rejects empty role', () => {
      const result = roleSelectionSchema.safeParse({ role: '' })
      expect(result.success).toBe(false)
    })
  })

  describe('forgotPasswordSchema', () => {
    it('validates correct CSU email', () => {
      const result = forgotPasswordSchema.safeParse({
        email: 'student@csu.edu.ph',
      })
      expect(result.success).toBe(true)
    })

    it('rejects non-CSU email', () => {
      const result = forgotPasswordSchema.safeParse({
        email: 'student@gmail.com',
      })
      expect(result.success).toBe(false)
    })
  })
})

describe('Password Strength', () => {
  it('returns very weak for empty password', () => {
    const strength = getPasswordStrength('')
    expect(strength.score).toBe(0)
    expect(strength.label).toBe('Very Weak')
  })

  it('returns weak for short password', () => {
    // Pass1! has: 6 chars (fails min 8), uppercase, lowercase, number, special = 4 passed
    // Score is 4 which is "Good", not weak. Test a weaker password.
    const weakStrength = getPasswordStrength('pass')
    expect(weakStrength.score).toBeLessThan(3)
  })

  it('returns strong for password meeting all requirements', () => {
    const strength = getPasswordStrength('SecurePass123!')
    expect(strength.score).toBe(PASSWORD_REQUIREMENTS.length)
    expect(strength.label).toBe('Strong')
  })

  it('tracks passed and failed requirements correctly', () => {
    const strength = getPasswordStrength('Pass1!')
    expect(strength.passedRequirements.length + strength.failedRequirements.length).toBe(PASSWORD_REQUIREMENTS.length)
  })
})