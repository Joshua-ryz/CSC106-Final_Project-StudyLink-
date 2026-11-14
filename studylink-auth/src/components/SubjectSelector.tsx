/**
 * SubjectSelector Component
 * Unified subject selection with predefined chips and custom subject entry
 * Supports Student (subjects needing help) and Tutor (subjects can teach) contexts
 * NFR-004 NFR-005 NFR-011 references
 */

import { forwardRef, useState } from 'react'
import { cn } from '@/utils'
import { BookOpen, Plus, X, CheckCircle } from 'lucide-react'

// Predefined subject list - shared between student and tutor
export const predefinedSubjects = [
  'Calculus',
  'Physics',
  'Data Structures',
  'Algorithms',
  'Web Development',
  'Programming',
  'Linear Algebra',
  'Statistics',
  'Discrete Mathematics',
  'General Chemistry',
  'Organic Chemistry',
  'Physical Chemistry',
] as const

// Subject-specific colors for visual distinction
const subjectColors: Record<string, string> = {
  'Calculus': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Physics': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Data Structures': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Algorithms': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Web Development': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Programming': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Linear Algebra': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Statistics': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  'Discrete Mathematics': 'bg-red-500/20 text-red-400 border-red-500/30',
  'General Chemistry': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Organic Chemistry': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Physical Chemistry': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
} as const

const subjectIcons: Record<string, typeof BookOpen> = {
  'Calculus': BookOpen,
  'Physics': BookOpen,
  'Data Structures': BookOpen,
  'Algorithms': BookOpen,
  'Web Development': BookOpen,
  'Programming': BookOpen,
  'Linear Algebra': BookOpen,
  'Statistics': BookOpen,
  'Discrete Mathematics': BookOpen,
  'General Chemistry': BookOpen,
  'Organic Chemistry': BookOpen,
  'Physical Chemistry': BookOpen,
} as const

interface SubjectSelectorProps {
  /** Currently selected subjects */
  value: string[]
  /** Callback when selection changes */
  onChange: (subjects: string[]) => void
  /** Disabled subjects (e.g., already selected in other role) */
  disabledSubjects?: string[]
  /** Context: 'student' for subjects needing help, 'tutor' for subjects can teach */
  context?: 'student' | 'tutor'
  /** Custom validation error */
  error?: string
  /** Disabled state */
  disabled?: boolean
  /** ARIA label */
  ariaLabel?: string
}

/**
 * Normalize subject name for comparison (trim, lowercase)
 */
function normalizeSubject(name: string): string {
  return name.trim().toLowerCase()
}

/**
 * Check if a subject already exists in the list (case-insensitive)
 */
function hasDuplicate(existing: string[], newSubject: string): boolean {
  const normalized = normalizeSubject(newSubject)
  return existing.some(s => normalizeSubject(s) === normalized)
}

export const SubjectSelector = forwardRef<HTMLDivElement, SubjectSelectorProps>(
  (
    {
      value,
      onChange,
      disabledSubjects = [],
      context = 'student',
      error,
      disabled = false,
      ariaLabel = 'Select subjects',
    },
    ref
  ) => {
    const [customInput, setCustomInput] = useState('')
    const [duplicateError, setDuplicateError] = useState<string | undefined>(undefined)

    const isSelected = (subject: string) => value.includes(subject)
    const isDisabled = (subject: string) => disabledSubjects.includes(subject) || disabled

    const handlePredefinedToggle = (subject: string) => {
      if (isDisabled(subject)) return
      setDuplicateError(undefined)
      const newValue = isSelected(subject)
        ? value.filter(s => s !== subject)
        : [...value, subject]
      onChange(newValue)
    }

    const handleCustomAdd = () => {
      const trimmed = customInput.trim()
      if (!trimmed) return
      if (hasDuplicate(value, trimmed)) {
        setDuplicateError('This subject has already been added.')
        return
      }
      if (trimmed.length > 80) {
        setDuplicateError('Subject name is too long (max 80 characters).')
        return
      }
      setDuplicateError(undefined)
      onChange([...value, trimmed])
      setCustomInput('')
    }

    const handleCustomKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleCustomAdd()
      }
    }

    const handleRemoveCustom = (subject: string) => {
      onChange(value.filter(s => s !== subject))
    }

    // Separate predefined and custom subjects
    const customSelected = value.filter(s => !predefinedSubjects.includes(s as typeof predefinedSubjects[number]))

    // Context-specific labels and placeholders
    const labels = {
      student: {
        sectionTitle: 'Subjects You Need Help With',
        helperText: 'Tap to select one or more subjects.',
        customLabel: 'Can\'t find your subject?',
        customPlaceholder: 'Enter a subject you need help with...',
      },
      tutor: {
        sectionTitle: 'Subjects You Can Tutor',
        helperText: 'Tap to select one or more subjects.',
        customLabel: 'Have expertise in another subject?',
        customPlaceholder: 'Enter a subject you can teach...',
      },
    }

    const currentLabels = labels[context]

    return (
      <div ref={ref} className="w-full" role="group" aria-label={ariaLabel}>
        {/* Section label */}
        <label className="block mb-2 text-sm font-medium text-sl-text-primary">
          {currentLabels.sectionTitle}
          <span className="text-sl-error" aria-hidden="true">*</span>
        </label>

        {/* Helper text */}
        <p className="mb-3 text-sm text-sl-text-secondary">{currentLabels.helperText}</p>

        {/* Predefined subject chips - 2 column grid */}
        <div
          className="grid grid-cols-2 gap-3 mb-4"
          role="listbox"
          aria-label="Available subjects"
        >
          {predefinedSubjects.map((subject) => {
            const selected = isSelected(subject)
            const disabled = isDisabled(subject)
            const colorClass = subjectColors[subject] || 'bg-sl-accent-primary/20 text-sl-accent-primary border-sl-accent-primary/30'
            const Icon = subjectIcons[subject] || BookOpen

            return (
              <button
                key={subject}
                type="button"
                role="option"
                aria-selected={selected}
                aria-disabled={disabled}
                disabled={disabled}
                onClick={() => handlePredefinedToggle(subject)}
                className={cn(
                  'relative p-3.5 rounded-xl transition-all duration-200',
                  'border-2 flex items-center gap-3',
                  'min-h-[64px]', // Consistent height for 2-line text
                  'hover:border-sl-accent-primary/50 hover:bg-sl-accent-primary/10',
                  'focus:outline-none focus:ring-2 focus:ring-sl-accent-primary focus:ring-offset-2 focus:ring-offset-sl-bg-main',
                  selected && 'bg-sl-accent-primary/20 border-sl-accent-primary shadow-[0_0_0_2px_rgba(119,117,245,0.3)]',
                  disabled && 'opacity-50 cursor-not-allowed',
                  colorClass
                )}
                aria-label={selected ? `Deselect ${subject}` : `Select ${subject}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium whitespace-normal break-words leading-snug text-balance">
                  {subject}
                </span>
                {selected && (
                  <CheckCircle className="ml-auto w-5 h-5 text-sl-accent-primary animate-in scale-in flex-shrink-0" aria-hidden="true" />
                )}
              </button>
            )
          })}
        </div>

        {/* Custom subject input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-sl-text-secondary">{currentLabels.customLabel}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => {
                setCustomInput(e.target.value)
                if (duplicateError) setDuplicateError(undefined)
              }}
              onKeyDown={handleCustomKeyDown}
              placeholder={currentLabels.customPlaceholder}
              disabled={disabled}
              className={cn(
                'input-field flex-1 min-w-0',
                duplicateError && 'border-sl-error focus:border-sl-error focus:ring-sl-error/20'
              )}
              aria-label={currentLabels.customPlaceholder}
              aria-invalid={duplicateError ? true : false}
              aria-describedby={duplicateError ? 'custom-subject-error' : undefined}
            />
            <button
              type="button"
              onClick={handleCustomAdd}
              disabled={disabled || !customInput.trim() || !!duplicateError}
              className={cn(
                'inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-sl-accent-primary text-white font-medium rounded-xl',
                'transition-all duration-200',
                'hover:bg-sl-accent-primary/90 hover:shadow-glow-primary hover:-translate-y-0.5',
                'active:scale-[0.98] active:translate-y-0',
                'focus:outline-none focus:ring-2 focus:ring-sl-accent-primary focus:ring-offset-2 focus:ring-offset-sl-bg-main',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none',
                'whitespace-nowrap flex-shrink-0'
              )}
              aria-label="Add custom subject"
            >
              <Plus className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:inline">Add Subject</span>
            </button>
          </div>
          {duplicateError && (
            <p id="custom-subject-error" className="text-sm text-sl-error flex items-center gap-1" role="alert">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {duplicateError}
            </p>
          )}
        </div>

        {/* Selected custom subjects display */}
        {customSelected.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2" role="list" aria-label="Custom subjects added">
            {customSelected.map((subject) => (
              <div
                key={subject}
                className="inline-flex items-center gap-2 px-3 py-2 bg-sl-accent-primary/20 border-2 border-sl-accent-primary rounded-xl text-sl-accent-primary text-sm font-medium"
                role="listitem"
              >
                <BookOpen className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span className="whitespace-normal break-words max-w-[200px]">{subject}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCustom(subject)}
                  disabled={disabled}
                  className="flex-shrink-0 p-1 rounded-lg hover:bg-sl-accent-primary/30 transition-colors"
                  aria-label={`Remove ${subject}`}
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Validation error */}
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

SubjectSelector.displayName = 'SubjectSelector'

// Export predefined subjects for external use
export { predefinedSubjects as SUBJECTS }
export type { SubjectSelectorProps }