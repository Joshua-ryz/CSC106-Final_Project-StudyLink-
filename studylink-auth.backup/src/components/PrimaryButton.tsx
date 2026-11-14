/**
 * PrimaryButton Component
 * Main action button with loading, disabled, and variant states
 */

import React from 'react'
import { cn } from '@/utils'
import { Loader2 } from 'lucide-react'

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

export function PrimaryButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className,
  ...props
}: PrimaryButtonProps) {
  const variants = {
    primary: 'bg-sl-accent-primary text-white hover:bg-sl-accent-primary/90 hover:shadow-glow-primary hover:-translate-y-0.5 active:scale-[0.98]',
    secondary: 'bg-sl-bg-secondary text-sl-text-primary border border-sl-border hover:bg-sl-bg-input hover:border-sl-accent-primary/50 hover:text-sl-accent-primary active:scale-[0.98]',
    ghost: 'text-sl-text-secondary hover:text-sl-accent-primary hover:bg-sl-bg-secondary rounded-lg',
  }

  const sizes = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-6 py-3.5 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:ring-2 focus:ring-sl-accent-primary focus:ring-offset-2 focus:ring-offset-sl-bg-main disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <button
      type="button"
      className={cn(baseStyles, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
      )}
      {children}
    </button>
  )
}