/**
 * CollegeSelector Component
 * Searchable dropdown for CSU college selection
 * NFR-004 NFR-005 NFR-011 references
 */

import { forwardRef } from 'react'
import { cn } from '@/utils'
import { ChevronDown, GraduationCap } from 'lucide-react'

interface College {
  code: string
  name: string
  display: string
}

const colleges: College[] = [
  { code: 'CED', name: 'College of Education', display: 'CED - College of Education' },
  { code: 'CAA', name: 'College of Agriculture and Agri-Industries', display: 'CAA - College of Agriculture and Agri-Industries' },
  { code: 'CMNS', name: 'College of Mathematics and Natural Sciences', display: 'CMNS - College of Mathematics and Natural Sciences' },
  { code: 'CHASS', name: 'College of Humanities and Social Sciences', display: 'CHASS - College of Humanities and Social Sciences' },
  { code: 'CCIS', name: 'College of Computing and Information Sciences', display: 'CCIS - College of Computing and Information Sciences' },
  { code: 'CEGS', name: 'College of Engineering and Geosciences', display: 'CEGS - College of Engineering and Geosciences' },
  { code: 'COFES', name: 'College of Forestry and Environmental Sciences', display: 'COFES - College of Forestry and Environmental Sciences' },
]

interface CollegeSelectorProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
  id?: string
  placeholder?: string
  leftIcon?: React.ReactNode
}

export const CollegeSelector = forwardRef<HTMLSelectElement, CollegeSelectorProps>(
  (
    {
      label,
      value = '',
      onChange,
      error,
      disabled,
      required,
      id,
      placeholder = 'Select your college',
      leftIcon = <GraduationCap className="w-5 h-5" />,
      ...props
    },
    ref
  ) => {
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
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          {...props}
        >
          <option value="" disabled={required}>
            {placeholder}
          </option>
          {colleges.map((college) => (
            <option key={college.code} value={college.display}>
              {college.display}
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

CollegeSelector.displayName = 'CollegeSelector'

export { colleges }
export type { CollegeSelectorProps, College }