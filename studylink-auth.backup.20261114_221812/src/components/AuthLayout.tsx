/**
 * AuthLayout Component
 * Split-screen layout for authentication pages
 * Desktop: Brand panel (left) + Form panel (right)
 * Mobile: Form panel only (brand panel hidden)
 */

import React from 'react'
import { BrandPanel } from './BrandPanel'
import { cn } from '@/utils'

interface AuthLayoutProps {
  children: React.ReactNode
  className?: string
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className={cn('auth-container min-h-screen', className)}>
      <BrandPanel />
      <main className="form-panel w-full lg:w-1/2">
        <div className="w-full max-w-md mx-auto animate-in slide-up">
          {children}
        </div>
      </main>
    </div>
  )
}