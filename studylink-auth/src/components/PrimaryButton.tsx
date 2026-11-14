/**
 * PrimaryButton Component (Legacy Wrapper)
 * Uses shared Button component internally for consistency
 * @deprecated Use Button component directly from '@/components'
 */

import { Button, type ButtonProps } from './ui/button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/utils'

interface PrimaryButtonProps extends Omit<ButtonProps, 'variant' | 'iconRight'> {
  variant?: 'primary' | 'secondary' | 'ghost'
  iconRight?: React.ReactNode
}

/**
 * @deprecated Use Button component directly with variant prop instead.
 * PrimaryButton is kept for backward compatibility.
 * Example: <Button variant="primary" iconRight={<ArrowRight />} />
 */
export function PrimaryButton({
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  iconRight = <ArrowRight className="w-4 h-4" aria-hidden="true" />,
  loading = false,
  disabled,
  className,
  children,
  ...props
}: PrimaryButtonProps) {
  const variantMap = {
    primary: 'primary' as const,
    secondary: 'secondary' as const,
    ghost: 'ghost' as const,
  }

  return (
      <Button
          variant={variantMap[variant]}
          size={size}
          loading={loading}
          fullWidth={fullWidth}
          disabled={disabled}
          className={cn('mt-2', className)}
          iconRight={iconRight}
          {...props}
      >
          {children}
      </Button>
  )
}

PrimaryButton.displayName = 'PrimaryButton'