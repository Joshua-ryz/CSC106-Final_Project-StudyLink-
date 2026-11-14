/**
 * SubjectCard Component
 * Selectable subject cards for tutor registration (Part C)
 * NFR-004 NFR-005 NFR-011 references
 */

import { forwardRef } from 'react'
import { cn } from '@/utils'
import { BookOpen, CheckCircle } from 'lucide-react'

interface SubjectCardProps {
  subject: string
  isSelected: boolean
  isDisabled?: boolean
  onToggle: (subject: string) => void
}

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

const subjects_list = [
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

export const SubjectCard = forwardRef<HTMLButtonElement, SubjectCardProps>(
  ({ subject, isSelected, isDisabled, onToggle }, ref) => {
    const colorClass = subjectColors[subject] || 'bg-sl-accent-primary/20 text-sl-accent-primary border-sl-accent-primary/30'
    const Icon = subjectIcons[subject] || BookOpen

    return (
      <button
        ref={ref}
        type="button"
        role={isDisabled && !isSelected ? 'button' : 'checkbox'}
        aria-checked={isSelected}
        disabled={isDisabled && !isSelected}
        onClick={() => !isDisabled && onToggle(subject)}
        className={cn(
        'relative p-3 rounded-xl transition-all duration-200',
        'border-2 flex items-center gap-3',
        'hover:border-sl-accent-primary/50 hover:bg-sl-accent-primary/10',
        'focus:outline-none focus:ring-2 focus:ring-sl-accent-primary focus:ring-offset-2 focus:ring-offset-sl-bg-main',
        isSelected && 'bg-sl-accent-primary/20 border-sl-accent-primary shadow-[0_0_0_2px_rgba(119,117,245,0.3)]',
        isDisabled && !isSelected && 'opacity-50 cursor-not-allowed',
        colorClass
      )}
        aria-label={isSelected ? `Deselect ${subject}` : `Select ${subject}`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
        <span className="text-sm font-medium">{subject}</span>
        {isSelected && (
        <CheckCircle className="ml-auto w-4 h-4 text-sl-accent-primary animate-in scale-in" aria-hidden="true" />
      )}
      </button>
    )
  }
)

SubjectCard.displayName = 'SubjectCard'

// Subject grid component - uses SubjectCard instead of raw checkboxes
export function SubjectGrid({
  selectedSubjects,
  onSubjectChange,
  disabledSubjects = [],
}: {
  selectedSubjects: string[]
  onSubjectChange: (subjects: string[]) => void
  disabledSubjects?: string[]
}) {
  const handleToggle = (subject: string) => {
    const newSelection = selectedSubjects.includes(subject)
      ? selectedSubjects.filter(s => s !== subject)
      : [...selectedSubjects, subject]
    onSubjectChange(newSelection)
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="listbox" aria-label="Available subjects">
      {subjects_list.map(subject => (
        <SubjectCard
          key={subject}
          subject={subject}
          isSelected={selectedSubjects.includes(subject)}
          isDisabled={disabledSubjects.includes(subject)}
          onToggle={handleToggle}
        />
      ))}
    </div>
  )
}

// For tutor role
export const tutorSubjects = [
  'Programming',
  'Data Structures',
  'Algorithms',
  'Web Development',
  'Calculus',
  'Physics',
  'Linear Algebra',
  'Statistics',
  'Discrete Mathematics',
  'General Chemistry',
  'Organic Chemistry',
  'Physical Chemistry',
] as const

// For student role
export const studentSubjects = tutorSubjects

export { subjects_list as subjects }
export type { SubjectCardProps }