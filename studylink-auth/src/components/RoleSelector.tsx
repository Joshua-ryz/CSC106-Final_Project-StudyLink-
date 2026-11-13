/**
 * RoleSelector Component
 * Three selectable cards for Tutee, Tutor, and Both roles
 * Keyboard accessible with proper ARIA attributes
 */

import React from 'react'
import { GraduationCap, UserCheck, Users, CheckCircle } from 'lucide-react'
import { cn } from '@/utils'
import { ROLE_OPTIONS, UserRole } from '@/types/auth'

interface RoleSelectorProps {
  value: UserRole | ''
  onChange: (role: UserRole) => void
  error?: string
  disabled?: boolean
}

const roleIcons = {
  TUTEE: GraduationCap,
  TUTOR: UserCheck,
  BOTH: Users,
}

const roleColors = {
  TUTEE: 'from-blue-500 to-blue-600',
  TUTOR: 'from-green-500 to-green-600',
  BOTH: 'from-purple-500 to-purple-600',
}

export function RoleSelector({ value, onChange, error, disabled }: RoleSelectorProps) {
  const handleKeyDown = (e: React.KeyboardEvent, role: UserRole) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!disabled) onChange(role)
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      const currentIndex = ROLE_OPTIONS.findIndex(opt => opt.value === value)
      const nextIndex = (currentIndex + 1) % ROLE_OPTIONS.length
      if (!disabled) onChange(ROLE_OPTIONS[nextIndex].value)
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      const currentIndex = ROLE_OPTIONS.findIndex(opt => opt.value === value)
      const prevIndex = (currentIndex - 1 + ROLE_OPTIONS.length) % ROLE_OPTIONS.length
      if (!disabled) onChange(ROLE_OPTIONS[prevIndex].value)
    }
  }

  return (
    <div className="w-full" role="radiogroup" aria-label="Select your account role" aria-invalid={error ? 'true' : 'false'}>
      <Label className="label-text">Account Role <span className="text-sl-error" aria-hidden="true">*</span></Label>
      <p className="mt-1 text-sm text-sl-text-secondary mb-4">
        Choose how you want to use StudyLink. You can change this later in your profile.
      </p>

      <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Account role options">
        {ROLE_OPTIONS.map((option, index) => {
          const Icon = roleIcons[option.value]
          const isSelected = value === option.value
          const colorGradient = roleColors[option.value as keyof typeof roleColors]

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={option.label}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => !disabled && onChange(option.value)}
              onKeyDown={(e) => handleKeyDown(e, option.value)}
              disabled={disabled}
              className={cn(
                'role-card group',
                isSelected && 'role-card-selected',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              style={{
                animationDelay: `${index * 0.05}s`,
              }}
            >
              <div className="role-card-icon group-hover:scale-105 transition-transform duration-200">
                <Icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-sl-text-primary group-hover:text-sl-accent-primary transition-colors">
                  {option.label}
                </h4>
                <p className="mt-1 text-sm text-sl-text-secondary line-clamp-2">
                  {option.description}
                </p>
              </div>
              {isSelected && (
                <div className="absolute top-3 right-3 animate-in scale-in">
                  <CheckCircle className="w-5 h-5 text-sl-accent-primary" aria-hidden="true" />
                </div>
              )}
              <div
                className={cn(
                  'absolute inset-0 rounded-xl',
                  isSelected
                    ? `bg-gradient-to-br ${colorGradient} opacity-10`
                    : 'bg-transparent'
                )}
                aria-hidden="true"
              />
            </button>
          )
        })}
      </div>

      {error && (
        <p className="error-text" role="alert">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

import { Label } from './ui/label'