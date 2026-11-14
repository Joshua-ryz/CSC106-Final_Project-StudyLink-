/**
 * AvailabilityPicker Component
 * Selectable availability time slots: Morning, Afternoon, Evening
 * Consistent selection design with other selectors
 * NFR-004 NFR-005 NFR-011 references
 */

import { forwardRef } from 'react'
import { cn } from '@/utils'
import { CheckCircle } from 'lucide-react'

type AvailabilityTime = 'morning' | 'afternoon' | 'evening'
type Availability = Record<AvailabilityTime, boolean>

const defaultAvailability: Availability = {
  morning: false,
  afternoon: false,
  evening: false,
}

const timeLabels = {
  morning: 'Morning (8AM - 12PM)',
  afternoon: 'Afternoon (1PM - 5PM)',
  evening: 'Evening (6PM - 10PM)',
} as const

const timeIcons = {
  morning: '☀️',
  afternoon: '🌤️',
  evening: '🌙',
} as const

const times: AvailabilityTime[] = ['morning', 'afternoon', 'evening']

export function parseAvailability(value: string | Availability): Availability {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return { ...defaultAvailability, ...parsed }
    } catch {
      return defaultAvailability
    }
  }
  return { ...defaultAvailability, ...value }
}

interface AvailabilityPickerProps {
  value: Availability
  onChange: (availability: Availability) => void
  disabled?: boolean
  label?: string
  error?: string
  ariaLabel?: string
  helperText?: string
}

export const AvailabilityPicker = forwardRef<HTMLDivElement, AvailabilityPickerProps>(
  ({ value, onChange, disabled, label, error, ariaLabel, helperText }, ref) => {
    const effectiveLabel = label || 'Availability'
    const effectiveAriaLabel = ariaLabel || 'Select available time slots for tutoring sessions'
    const effectiveHelperText = helperText || "Select when you're available for tutoring sessions"

    const handleChange = (time: AvailabilityTime) => {
      const newValue = { ...value, [time]: !value[time] }
      onChange(newValue)
    }

    const hasSelection = Object.values(value).some(v => v)

    return (
      <div ref={ref} className="w-full" role="group" aria-label={effectiveAriaLabel}>
        <label className="block mb-2 text-sm font-medium text-sl-text-primary">
          {effectiveLabel}
          <span className="text-sl-error" aria-hidden="true">*</span>
        </label>
        <p className="mb-3 text-sm text-sl-text-secondary">{effectiveHelperText}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="group" aria-label={effectiveAriaLabel}>
          {times.map((time) => {
            const isSelected = value[time] || false
            const isDisabled = disabled || false

            return (
              <label
                key={time}
                className={cn(
                  'relative flex flex-col items-center gap-2 cursor-pointer p-4 rounded-xl border-2 transition-all duration-200',
                  'hover:border-sl-accent-primary/50 hover:bg-sl-accent-primary/10',
                  'focus-within:ring-2 focus-within:ring-sl-accent-primary focus-within:ring-offset-2 focus-within:ring-offset-sl-bg-main',
                  isSelected && 'border-sl-accent-primary bg-sl-accent-primary/20',
                  isDisabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <span className="text-2xl" aria-hidden="true">{timeIcons[time]}</span>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => !isDisabled && handleChange(time)}
                  disabled={isDisabled}
                  className={cn(
                    'appearance-none h-5 w-5 rounded-md border transition-all duration-200',
                    'checked:bg-sl-accent-primary checked:border-sl-accent-primary',
                    'focus:outline-none focus:ring-2 focus:ring-sl-accent-primary focus:ring-offset-2 focus:ring-offset-sl-bg-main',
                  )}
                  role="checkbox"
                  aria-label={timeLabels[time]}
                  aria-checked={isSelected}
                  data-testid={`availability-${time}`}
                />
                <span className="text-sm font-medium text-sl-text-primary text-center">{timeLabels[time]}</span>
                {isSelected && (
                  <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-sl-accent-primary animate-in scale-in" aria-hidden="true" />
                )}
                {isDisabled && !isSelected && (
                  <span className="absolute top-2 right-2 text-xs text-sl-text-secondary/50">Full</span>
                )}
              </label>
            )
          })}
        </div>
        {hasSelection && error && (
          <p className="mt-3 text-sm text-sl-error flex items-center gap-1" role="alert">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
)

AvailabilityPicker.displayName = 'AvailabilityPicker'

// For backward compatibility with existing code
export const StudentAvailabilityPicker = (props: Omit<AvailabilityPickerProps, 'label' | 'helperText'>) => (
  <AvailabilityPicker
    label="Student Availability"
    helperText="Select when you're available for tutoring sessions"
    {...props}
  />
)

export const TutorAvailabilityPicker = (props: Omit<AvailabilityPickerProps, 'label' | 'helperText'>) => (
  <AvailabilityPicker
    label="Tutor Availability"
    helperText="Select when you're available for tutoring sessions"
    {...props}
  />
)

export type { AvailabilityPickerProps, Availability, AvailabilityTime }
export { defaultAvailability }