/**
 * Authentication E2E Tests
 * Tests login, registration, and password reset flows
 */

import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
  })

  test.describe('Login Page', () => {
    test('should display login form with all elements', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible()
      await expect(page.locator('input[type="email"]')).toBeVisible()
      await expect(page.locator('input[type="password"]')).toBeVisible()
      await expect(page.locator('button[type="submit"]')).toContainText('Sign In')
      await expect(page.locator('text=Forgot password?')).toBeVisible()
      await expect(page.locator('text=Create one')).toBeVisible()
    })

    test('should show error for empty email', async ({ page }) => {
      await page.fill('input[type="password"]', 'password123')
      await page.click('button[type="submit"]')
      await expect(page.locator('text=Email is required')).toBeVisible()
    })

    test('should show error for empty password', async ({ page }) => {
      await page.fill('input[type="email"]', 'student@csu.edu.ph')
      await page.click('button[type="submit"]')
      await expect(page.locator('text=Password is required')).toBeVisible()
    })

    test('should show error for invalid email format', async ({ page }) => {
      await page.fill('input[type="email"]', 'invalid-email')
      await page.fill('input[type="password"]', 'password123')
      await page.click('button[type="submit"]')
      await expect(page.locator('text=Please enter a valid email address')).toBeVisible()
    })

    test('should show error for non-CSU email', async ({ page }) => {
      await page.fill('input[type="email"]', 'student@gmail.com')
      await page.fill('input[type="password"]', 'password123')
      await page.click('button[type="submit"]')
      await expect(page.locator('text=Please use your official Caraga State University email address')).toBeVisible()
    })

    test('should toggle password visibility', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first()
      await expect(passwordInput).toHaveAttribute('type', 'password')

      // Click show password button
      await page.click('button[aria-label="Show password"]')
      // Re-locate the input since its type changed
      const visibleInput = page.locator('input[type="text"]').first()
      await expect(visibleInput).toHaveAttribute('type', 'text')

      // Click hide password button
      await page.click('button[aria-label="Hide password"]')
      const hiddenInput = page.locator('input[type="password"]').first()
      await expect(hiddenInput).toHaveAttribute('type', 'password')
    })

    test('should navigate to register page', async ({ page }) => {
      await page.click('text=Create one')
      await expect(page).toHaveURL(/.*register/)
      await expect(page.locator('span:has-text("Personal Info")').first()).toBeVisible()
    })

    test('should navigate to forgot password page', async ({ page }) => {
      await page.click('text=Forgot password?')
      await expect(page).toHaveURL(/.*forgot-password/)
      await expect(page.getByRole('heading', { name: 'Forgot Password?' })).toBeVisible()
    })
  })

  test.describe('Registration Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/register')
      await page.waitForLoadState('networkidle')
    })

    test('should display step 1 - personal info', async ({ page }) => {
      await expect(page.locator('text=Personal Info')).toBeVisible()
      await expect(page.locator('input[id*="fullName"]')).toBeVisible()
      await expect(page.locator('input[type="email"]')).toBeVisible()
      await expect(page.locator('input[id*="course"]')).toBeVisible()
    })

    test('should show validation errors for step 1', async ({ page }) => {
      await page.click('button:has-text("Continue")')
      await expect(page.locator('text=Full name is required')).toBeVisible()
      await expect(page.locator('text=Email is required')).toBeVisible()
      await expect(page.locator('text=Course/Program is required')).toBeVisible()
    })

    test('should validate email format in step 1', async ({ page }) => {
      await page.fill('input[id*="fullName"]', 'Test User')
      await page.fill('input[type="email"]', 'invalid-email')
      await page.fill('input[id*="course"]', 'BS Computer Science')
      await page.click('button:has-text("Continue")')
      await expect(page.locator('text=Please enter a valid email address')).toBeVisible()
    })

    test('should navigate to step 2 - role selection', async ({ page }) => {
      await page.fill('input[id*="fullName"]', 'Test User')
      await page.fill('input[type="email"]', 'test@carsu.edu.ph')
      await page.fill('input[id*="course"]', 'BS Computer Science')
      await page.click('button:has-text("Continue")')

      await expect(page.locator('text=Account Role')).toBeVisible()
      await expect(page.locator('text=I need tutoring')).toBeVisible()
      await expect(page.locator('text=I want to be a tutor')).toBeVisible()
      await expect(page.locator('text=Both')).toBeVisible()
    })

    test('should require role selection', async ({ page }) => {
      await page.fill('input[id*="fullName"]', 'Test User')
      await page.fill('input[type="email"]', 'test@carsu.edu.ph')
      await page.fill('input[id*="course"]', 'BS Computer Science')
      await page.click('button:has-text("Continue")')
      await page.click('button:has-text("Continue")')
      await expect(page.locator('text=Please select an account role')).toBeVisible()
    })

    test('should navigate to step 3 - details', async ({ page }) => {
      await page.fill('input[id*="fullName"]', 'Test User')
      await page.fill('input[type="email"]', 'test@carsu.edu.ph')
      await page.fill('input[id*="course"]', 'BS Computer Science')
      await page.click('button:has-text("Continue")')

      // Select role
      await page.click('text=I need tutoring')
      await page.click('button:has-text("Continue")')

      // Step 3 - Details for Seeker - check progress indicator shows step 3 (the step title in progress bar)
      await expect(page.locator('span:has-text("Details")').first()).toBeVisible()
      await expect(page.locator('text=Share your preferences')).toBeVisible()
    })

    test('should show password strength indicator', async ({ page }) => {
      await page.fill('input[id*="fullName"]', 'Test User')
      await page.fill('input[type="email"]', 'test@carsu.edu.ph')
      await page.fill('input[id*="course"]', 'BS Computer Science')
      await page.click('button:has-text("Continue")')
      await page.click('text=I need tutoring')
      await page.click('button:has-text("Continue")')

      // Fill step 3 - Details for Seeker
      await page.selectOption('select[id*="yearLevel"]', '1st Year')
      // Click on a subject chip
      await page.click('button:has-text("Calculus")')
      // Click on Morning availability
      await page.click('label:has-text("Morning") >> input')
      await page.click('button:has-text("Continue")')

      // Step 4 - Security
      await page.fill('input[type="password"]', 'Weak1!')
      // Check password strength indicator appears (the label text)
      await expect(page.locator('text=/Weak|Fair|Good|Strong/')).toBeVisible()

      await page.fill('input[type="password"]', 'StrongPass123!')
      await expect(page.locator('text=/Strong|Good/')).toBeVisible()
    })

    test('should validate password requirements', async ({ page }) => {
      await page.fill('input[id*="fullName"]', 'Test User')
      await page.fill('input[type="email"]', 'test@carsu.edu.ph')
      await page.fill('input[id*="course"]', 'BS Computer Science')
      await page.click('button:has-text("Continue")')
      await page.click('text=I need tutoring')
      await page.click('button:has-text("Continue")')

      // Fill step 3 - Details for Seeker
      await page.selectOption('select[id*="yearLevel"]', '1st Year')
      await page.click('button:has-text("Calculus")')
      await page.click('label:has-text("Morning") >> input')
      await page.click('button:has-text("Continue")')

      // Step 4 - Security
      await page.fill('input[type="password"]', 'weak')
      await page.fill('input[id*="confirmPassword"]', 'weak')
      await page.click('button:has-text("Create Account")')

      await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible()
    })

    test('should validate password match', async ({ page }) => {
      await page.fill('input[id*="fullName"]', 'Test User')
      await page.fill('input[type="email"]', 'test@carsu.edu.ph')
      await page.fill('input[id*="course"]', 'BS Computer Science')
      await page.click('button:has-text("Continue")')
      await page.click('text=I need tutoring')
      await page.click('button:has-text("Continue")')

      // Fill step 3 - Details for Seeker
      await page.selectOption('select[id*="yearLevel"]', '1st Year')
      await page.click('button:has-text("Calculus")')
      await page.click('label:has-text("Morning") >> input')
      await page.click('button:has-text("Continue")')

      // Step 4 - Security
      await page.fill('input[type="password"]', 'SecurePass123!')
      await page.fill('input[id*="confirmPassword"]', 'DifferentPass123!')
      await page.click('button:has-text("Create Account")')

      await expect(page.locator('text=Passwords do not match')).toBeVisible()
    })

    test('should navigate back between steps', async ({ page }) => {
      await page.fill('input[id*="fullName"]', 'Test User')
      await page.fill('input[type="email"]', 'test@carsu.edu.ph')
      await page.fill('input[id*="course"]', 'BS Computer Science')
      await page.click('button:has-text("Continue")')

      await expect(page.locator('text=Account Role')).toBeVisible()

      await page.click('button:has-text("Back")')
      await expect(page.locator('text=Personal Info')).toBeVisible()
    })

    test('should navigate to login from register', async ({ page }) => {
      await page.click('text=Sign in')
      await expect(page).toHaveURL(/.*login/)
    })
  })

  test.describe('Forgot Password Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/forgot-password')
      await page.waitForLoadState('networkidle')
    })

    test('should display forgot password form', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Forgot Password?' })).toBeVisible()
      await expect(page.locator('input[type="email"]')).toBeVisible()
      await expect(page.locator('button:has-text("Send Reset Link")')).toBeVisible()
      await expect(page.locator('text=Back to Login')).toBeVisible()
    })

    test('should validate email', async ({ page }) => {
      await page.click('button:has-text("Send Reset Link")')
      await expect(page.locator('text=Email is required')).toBeVisible()
    })

    test('should validate email format', async ({ page }) => {
      await page.fill('input[type="email"]', 'invalid-email')
      await page.click('button:has-text("Send Reset Link")')
      await expect(page.locator('text=Please enter a valid email address')).toBeVisible()
    })

    test('should validate CSU email', async ({ page }) => {
      await page.fill('input[type="email"]', 'student@gmail.com')
      await page.click('button:has-text("Send Reset Link")')
      await expect(page.locator('text=Please use your official Caraga State University email address')).toBeVisible()
    })

    test('should show success state after submission', async ({ page }) => {
      await page.fill('input[type="email"]', 'test@carsu.edu.ph')
      await page.click('button:has-text("Send Reset Link")')

      // Should show success message
      await expect(page.locator('text=Check Your Email')).toBeVisible()
      await expect(page.locator('text=Resend Email')).toBeVisible()
      await expect(page.locator('text=Back to Login')).toBeVisible()
    })

    test('should navigate back to login', async ({ page }) => {
      await page.click('text=Back to Login')
      await expect(page).toHaveURL(/.*login/)
    })
  })

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/login')
      await page.waitForLoadState('networkidle')

      await expect(page.locator('input[type="email"]')).toBeVisible()
      await expect(page.locator('button[type="submit"]')).toBeVisible()

      // Brand panel should be hidden on mobile
      await expect(page.locator('.brand-panel')).toBeHidden()
    })

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/login')
      await page.waitForLoadState('networkidle')

      await expect(page.locator('input[type="email"]')).toBeVisible()
    })

    test('should show brand panel on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto('/login')
      await page.waitForLoadState('networkidle')

      // Brand panel should be visible on desktop
      await expect(page.locator('text=Learn Together. Grow Together.')).toBeVisible()
    })
  })

  test.describe('Keyboard Navigation', () => {
    test('should be keyboard navigable on login', async ({ page }) => {
      await page.goto('/login')
      await page.waitForLoadState('networkidle')

      // First tab might focus the email input (if not already)
      await page.keyboard.press('Tab')
      await expect(page.locator('input[type="email"]').first()).toBeFocused()

      await page.keyboard.press('Tab')
      await expect(page.locator('input[type="password"]').first()).toBeFocused()

      await page.keyboard.press('Tab')
      await expect(page.locator('input[type="checkbox"]').first()).toBeFocused()

      await page.keyboard.press('Tab')
      await expect(page.locator('text=Forgot password?').first()).toBeFocused()
    })

    test('should be keyboard navigable on role selection', async ({ page }) => {
      await page.goto('/register')
      await page.waitForLoadState('networkidle')

      await page.fill('input[id*="fullName"]', 'Test User')
      await page.fill('input[type="email"]', 'test@carsu.edu.ph')
      await page.fill('input[id*="course"]', 'BS Computer Science')
      await page.click('button:has-text("Continue")')

      // Role cards should be keyboard navigable
      await page.keyboard.press('Tab')
      await expect(page.locator('text=I need tutoring')).toBeFocused()

      await page.keyboard.press('ArrowRight')
      await expect(page.locator('text=I want to be a tutor')).toBeFocused()

      await page.keyboard.press('ArrowRight')
      await expect(page.locator('text=Both')).toBeFocused()
    })
  })
})