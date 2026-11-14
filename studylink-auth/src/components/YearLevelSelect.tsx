/**
 * YearLevelSelect Component
 * Shared dropdown for selecting year level (Part C)
 */

import { forwardRef } from 'react'
import { cn } from '@/utils'
import { ChevronDown } from 'lucide-react'
import { Calendar } from 'lucide-react'

export interface YearLevelSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  label: string
  value?: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
  leftIcon?: React.ReactNode
}

const yearLevels = [
  { value: '', label: 'Select Year Level' },
  { value: '1st Year', label: '1st Year (Freshman)' },
  { value: '2nd Year', label: '2nd Year (Sophomore)' },
  { value: '3rd Year', label: '3rd Year (Junior)' },
  { value: '4th Year', label: '4th Year (Senior)' },
  { value: '5th Year', label: '5th Year' },
  { value: 'Graduate', label: 'Graduate Student' },
] as const

export const YearLevelSelect = forwardRef<HTMLSelectElement, YearLevelSelectProps>(
  ({ label, value = '', onChange, error, disabled, required, className, id, leftIcon, ...props }, ref) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, '-')
    const hasLeftIcon = !!leftIcon

    return (
      <div className="w-full relative">
      <label htmlFor={selectId} className="block mb-2 text-sm font-medium text-sl-text-primary">
          {label} {required && <span className="text-sl-error" aria-hidden="true">*</span>}
        </label>
      {hasLeftIcon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sl-text-secondary/60 pointer-events-none" aria-hidden="true">
          {leftIcon}
        </div>
      )}
      <select
            ref={ref}
            id={selectId}
            value={value}
            onChange={e => onChange(e.target.value)}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${selectId}-error` : undefined}
            className={cn(
          'input-field appearance-none pr-12 cursor-pointer',
          hasLeftIcon && 'pl-12',
          error && 'border-sl-error focus:border-sl-error focus:ring-sl-error/20 pr-14',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
            {...props}
          >
            {yearLevels.map((level) => (
          <option
                      key={level.value}
                      value={level.value}
                      disabled={level.value === '' && required}
                >
                      {level.label}
                    </option>
              ))}
          </select>
          <div className="absolute right-4 top-0 h-full flex items-center pointer-events-none">
        <ChevronDown className="w-4 h-4 text-sl-text-secondary/60" aria-hidden="true" />
          </div>
          {error && (
          <p id={`${selectId}-error`} className="mt-1.5 text-sm text-sl-error flex items-center gap-1" role="alert">
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

YearLevelSelect.displayName = 'YearLevelSelect'

// Also export a version for InputField usage (with leftIcon Calendar)

interface YearLevelInputFieldProps extends Omit<YearLevelSelectProps, 'label'> {
  leftIcon?: React.ReactNode
  label?: string
}

export function YearLevelInputField({
  leftIcon = <Calendar className="w-5 h-5" />,
  value = '',
  onChange = () => {},
  label = 'Year Level',
  ...props
}: YearLevelInputFieldProps) {
  return (
    <YearLevelSelect
      leftIcon={leftIcon}
      value={value}
      onChange={onChange}
      label={label}
      {...props}
    />
  )
}