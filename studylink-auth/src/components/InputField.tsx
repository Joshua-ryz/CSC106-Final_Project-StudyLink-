/**
 * InputField Component
 * Reusable form input with label, left/right icons, error handling, and validation display
 * Supports password visibility toggle when showPasswordToggle is true
 *
 * NFR-004 NFR-005 NFR-011 references
 */

import React, { forwardRef } from 'react'
import { cn } from '@/utils'
import { Label } from './ui/label'

export interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      showPasswordToggle = false,
      type = 'text',
      className,
      id,
      disabled,
      required,
      value,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
    const hasLeftIcon = !!leftIcon
    const hasRightStaticIcon = !!rightIcon && !showPasswordToggle
    const hasPasswordToggle = !!showPasswordToggle
    const [showPassword, setShowPassword] = React.useState(false)

    const effectiveType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type

    const handleTogglePassword = () => {
      setShowPassword(!showPassword)
    }

    // Inline styles for padding - HIGHEST CSS specificity, cannot be overridden by global CSS
    const leftPaddingPx = hasLeftIcon ? 48 : 0 // 48px = 3rem = pl-12
    const rightPaddingPx = hasPasswordToggle ? 56 : (hasRightStaticIcon ? 48 : 0) // pr-14 (56) for toggle, pr-12 (48) for static
    const inputStyle: React.CSSProperties = {
      paddingLeft: leftPaddingPx ? `${leftPaddingPx}px` : undefined,
      paddingRight: rightPaddingPx ? `${rightPaddingPx}px` : undefined,
    }

    return (
      <div className="w-full">
      <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
        <div className="relative mt-2">
          {/* Left static icon */}
          {hasLeftIcon && (
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sl-text-secondary/60 pointer-events-none"
              aria-hidden="true"
              style={{ width: '20px', height: '20px' }}
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={effectiveType}
            id={inputId}
            disabled={disabled}
            required={required}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            style={inputStyle}
            className={cn(
              'input-field',
              error && 'border-sl-error focus:border-sl-error focus:ring-sl-error/20',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${inputId}-error`
                : hint
                ? `${inputId}-hint`
                : undefined
            }
            {...props}
          />

          {/* Password visibility toggle - right-4, z-10, proper aria attributes */}
          {showPasswordToggle && (
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-sl-text-secondary/60 hover:text-sl-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-sl-accent-primary focus:ring-offset-2 focus:ring-offset-sl-bg-main rounded-lg p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              disabled={disabled}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.878-3.29-3.29 7.532 7.532 3.29 3.29 3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542-7-1.274 4.057-5.064 7-9.542-7z" />
                </svg>
              )}
            </button>
          )}

          {/* Right static icon (not toggle) */}
          {hasRightStaticIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sl-text-secondary/60 pointer-events-none" aria-hidden="true">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-sl-error flex items-center gap-1" role="alert">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-sl-text-secondary">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

InputField.displayName = 'InputField'