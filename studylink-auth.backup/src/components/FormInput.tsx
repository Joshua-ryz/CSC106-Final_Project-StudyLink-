/**
 * FormInput Component
 * Reusable form input with label, error handling, and validation display
 */

import React from 'react'
import { cn } from '@/utils'
import { Label } from './ui/label'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export function FormInput({
  label,
  error,
  hint,
  icon,
  iconPosition = 'left',
  className,
  id,
  type = 'text',
  disabled,
  required,
  ...props
}: FormInputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
  const hasIcon = !!icon

  return (
    <div className="w-full">
      <Label htmlFor={inputId} required={required}>
        {label}
      </Label>
      <div className="relative mt-1.5">
        {hasIcon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sl-text-secondary/60 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={inputId}
          disabled={disabled}
          required={required}
          className={cn(
            'input-field',
            hasIcon && iconPosition === 'left' && 'pl-12',
            hasIcon && iconPosition === 'right' && 'pr-12',
            error && 'border-sl-error focus:border-sl-error focus:ring-sl-error/20',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {hasIcon && iconPosition === 'right' && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sl-text-secondary/60 pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="error-text" role="alert">
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