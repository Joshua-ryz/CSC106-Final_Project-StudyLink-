/**
 * Button Component
 * Based on shadcn/ui button with StudyLink styling
 */

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:ring-2 focus:ring-sl-accent-primary focus:ring-offset-2 focus:ring-offset-sl-bg-main disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-sl-accent-primary text-white hover:bg-sl-accent-primary/90 hover:shadow-glow-primary hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0',
      secondary: 'bg-sl-bg-secondary text-sl-text-primary border border-sl-border hover:bg-sl-bg-input hover:border-sl-accent-primary/50 hover:text-sl-accent-primary active:scale-[0.98]',
      ghost: 'text-sl-text-secondary hover:text-sl-accent-primary hover:bg-sl-bg-secondary rounded-lg px-4 py-2',
      destructive: 'bg-sl-error text-white hover:bg-sl-error/90 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-[0.98]',
      outline: 'border-2 border-sl-border bg-transparent hover:bg-sl-bg-secondary hover:border-sl-accent-primary/50 active:scale-[0.98]',
    }

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-5 py-3 text-base',
      lg: 'px-6 py-3.5 text-base',
      xl: 'px-8 py-4 text-lg',
    }

    return (
      <Comp
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button }