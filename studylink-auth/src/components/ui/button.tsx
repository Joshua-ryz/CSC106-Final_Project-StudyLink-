/**
 * Shared Button Component
 * Comprehensive button with variants, sizes, icon support, loading states, and accessibility
 * NFR-004 NFR-011 references
 */

import * as React from 'react'
import { cn } from '@/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

const variantStyles = {
  primary: 'bg-sl-accent-primary text-white hover:bg-sl-accent-primary/90 hover:shadow-glow-primary hover:-translate-y-0.5 active:scale-[0.98]',
  secondary: 'bg-sl-bg-secondary text-sl-text-primary border border-sl-border hover:bg-sl-bg-input hover:border-sl-accent-primary/50 hover:text-sl-accent-primary active:scale-[0.98]',
  outline: 'bg-transparent text-sl-text-primary border-2 border-sl-border hover:bg-sl-accent-primary/10 hover:border-sl-accent-primary hover:text-sl-accent-primary active:scale-[0.98]',
  ghost: 'bg-transparent text-sl-text-secondary hover:text-sl-accent-primary hover:bg-sl-bg-secondary rounded-lg',
} as const

const sizeStyles = {
  sm: 'px-4 py-2.5 text-sm',
  md: 'px-6 py-3.5 text-base',
  lg: 'px-8 py-4 text-lg',
} as const

const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sl-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-sl-bg-card disabled:opacity-50 disabled:cursor-not-allowed'

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      iconLeft,
      iconRight,
      disabled,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], fullWidth && 'w-full', className)}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <Loader2 className={cn('h-5 w-5 animate-spin', iconLeft && 'mr-2', !iconLeft && 'mr-2')} aria-hidden="true" />
        )}
        {!loading && iconLeft && <span className="mr-2" aria-hidden="true">{iconLeft}</span>}
        {children}
        {!loading && iconRight && <span className="ml-2" aria-hidden="true">{iconRight}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'