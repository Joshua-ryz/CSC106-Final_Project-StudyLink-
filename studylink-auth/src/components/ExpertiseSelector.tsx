/**
 * ExpertiseSelector Component
 * Selectable expertise levels: Beginner, Intermediate, Advanced
 * Supports multiple selections with consistent selection design
 * NFR-004 NFR-005 NFR-011 references
 */

import { forwardRef } from 'react'
import { cn } from '@/utils'
import { CheckCircle } from 'lucide-react'

interface ExpertiseLevel {
  value: 'beginner' | 'intermediate' | 'advanced'
  label: string
}

const expertiseLevels: ExpertiseLevel[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

interface ExpertiseSelectorProps {
  /** Currently selected expertise levels */
  value: { beginner: boolean; intermediate: boolean; advanced: boolean }
  /** Callback when selection changes */
  onChange: (expertise: { beginner: boolean; intermediate: boolean; advanced: boolean }) => void
  /** Custom validation error */
  error?: string
  /** Disabled state */
  disabled?: boolean
  /** ARIA label */
  ariaLabel?: string
}

export const ExpertiseSelector = forwardRef<HTMLDivElement, ExpertiseSelectorProps>(
  (
    {
      value,
      onChange,
      error,
      disabled = false,
      ariaLabel = 'Select expertise levels',
    },
    ref
  ) => {
    const handleToggle = (level: 'beginner' | 'intermediate' | 'advanced') => {
      const newValue = { ...value, [level]: !value[level] }
      onChange(newValue)
    }

    return (
      <div ref={ref} className="w-full" role="group" aria-label={ariaLabel}>
        <label className="block mb-2 text-sm font-medium text-sl-text-primary">
          Expertise Levels
          <span className="text-sl-error" aria-hidden="true">*</span>
        </label>
        <p className="mb-3 text-sm text-sl-text-secondary">
          Select all expertise levels you can teach
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="group" aria-label="Expertise levels">
          {expertiseLevels.map((level) => {
            const isSelected = value[level.value] || false

            return (
              <label
                key={level.value}
                className={cn(
                  'relative flex flex-col items-center gap-2 cursor-pointer p-4 rounded-xl border-2 transition-all duration-200',
                  'hover:border-sl-accent-secondary/50 hover:bg-sl-accent-secondary/10',
                  'focus-within:ring-2 focus-within:ring-sl-accent-secondary focus-within:ring-offset-2 focus-within:ring-offset-sl-bg-main',
                  isSelected && 'border-sl-accent-secondary bg-sl-accent-secondary/20',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => !disabled && handleToggle(level.value)}
                  disabled={disabled}
                  className={cn(
                    'appearance-none h-5 w-5 rounded-md border transition-all duration-200',
                    'checked:bg-sl-accent-secondary checked:border-sl-accent-secondary',
                    'focus:outline-none focus:ring-2 focus:ring-sl-accent-secondary focus:ring-offset-2 focus:ring-offset-sl-bg-main',
                  )}
                  aria-label={`${level.label} expertise`}
                  aria-checked={isSelected}
                />
                <span className="text-sm font-medium text-sl-text-primary text-center">{level.label}</span>
                {isSelected && (
                  <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-sl-accent-secondary animate-in scale-in" aria-hidden="true" />
                )}
              </label>
            )
          })}
        </div>

        {error && (
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

ExpertiseSelector.displayName = 'ExpertiseSelector'

export { expertiseLevels }
export type { ExpertiseSelectorProps }