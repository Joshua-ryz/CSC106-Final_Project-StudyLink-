/**
 * PasswordInput Component
 * Password field with show/hide toggle and optional strength indicator
 */

import { useState } from 'react'
import { Eye, EyeOff, Shield } from 'lucide-react'
import { cn } from '@/utils'
import { Label } from './ui/label'
import { getPasswordStrength, PASSWORD_REQUIREMENTS } from '@/utils/validation'

function getStrengthBgColor(textColor: string): string {
  const colorMap: Record<string, string> = {
    'text-sl-error': 'var(--sl-error)',
    'text-yellow-500': 'var(--sl-warning)',
    'text-sl-accent-secondary': 'var(--sl-accent-secondary)',
    'text-sl-success': 'var(--sl-success)',
  }
  return colorMap[textColor] || 'var(--sl-accent-primary)'
}

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
  hint?: string
  showStrength?: boolean
  strengthTarget?: 'password' | 'confirmPassword'
  icon?: React.ReactNode
}

export function PasswordInput({
  label,
  error,
  hint,
  showStrength = false,
  strengthTarget = 'password',
  className,
  id,
  disabled,
  required,
  value,
  onChange,
  icon,
  ...props
}: PasswordInputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
  const [showPassword, setShowPassword] = useState(false)
  const [strength, setStrength] = useState<{
    score: number
    label: string
    color: string
    passedRequirements: string[]
    failedRequirements: string[]
  }>({ score: 0, label: '', color: '', passedRequirements: [], failedRequirements: [] })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange?.(e)

    if (showStrength && strengthTarget === 'password') {
      setStrength(getPasswordStrength(newValue))
    }
  }

  const handleBlur = () => {
    if (showStrength && strengthTarget === 'password' && value) {
      setStrength(getPasswordStrength(String(value)))
    }
  }

  return (
    <div className="w-full">
      <Label htmlFor={inputId} required={required}>
        {label}
      </Label>
      <div className="relative mt-1.5">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sl-text-secondary/60 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={showPassword ? 'text' : 'password'}
          id={inputId}
          disabled={disabled}
          required={required}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            'input-field pr-12 pl-12',
            error && 'border-sl-error focus:border-sl-error focus:ring-sl-error/20',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-sl-text-secondary/60 hover:text-sl-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-sl-accent-primary focus:ring-offset-2 focus:ring-offset-sl-bg-main rounded-lg p-1"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-pressed={showPassword}
          disabled={disabled}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
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

      {showStrength && strengthTarget === 'password' && value && (
        <div className="mt-3 animate-in slide-down" role="region" aria-label="Password strength">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-1.5 bg-sl-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(strength.score / PASSWORD_REQUIREMENTS.length) * 100}%`,
                  backgroundColor: getStrengthBgColor(strength.color),
                }}
              />
            </div>
            <span className={cn('text-sm font-medium', strength.color)}>{strength.label}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {PASSWORD_REQUIREMENTS.map((req, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5"
                style={{ color: strength.passedRequirements.includes(req.label) ? 'var(--sl-success)' : 'var(--sl-text-secondary)' }}
              >
                <Shield
                  className={cn('w-3.5 h-3.5 flex-shrink-0', strength.passedRequirements.includes(req.label) ? 'text-sl-success' : 'text-sl-border')}
                  aria-hidden="true"
                />
                <span className={strength.passedRequirements.includes(req.label) ? 'line-through' : ''}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}