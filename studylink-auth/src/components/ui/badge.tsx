/**
 * Badge Component
 * Based on shadcn/ui badge with StudyLink styling
 */

import * as React from 'react'
import { cn } from '@/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'secondary' | 'outline'
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-sl-accent-primary/20 text-sl-accent-primary border-sl-accent-primary/30',
      success: 'bg-sl-success/20 text-sl-success border-sl-success/30',
      warning: 'bg-sl-warning/20 text-sl-warning border-sl-warning/30',
      error: 'bg-sl-error/20 text-sl-error border-sl-error/30',
      secondary: 'bg-sl-bg-secondary text-sl-text-secondary border-sl-border',
      outline: 'bg-transparent text-sl-text-secondary border-sl-border',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'

export { Badge }