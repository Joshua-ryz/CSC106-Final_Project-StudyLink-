/**
 * AuthLayout Component
 * Split-screen layout for authentication pages
 * Desktop: Brand panel (left, fixed) + Form panel (right, scrollable)
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
    <div className={cn('auth_container min-h-screen', className)}>
      <BrandPanel />
      <main className="form_panel w-full lg:w-1/2 min-h-screen">
        <div className="w-full max-w-2xl mx-auto animate-in slide-up lg:max-w-2xl">
          {children}
        </div>
      </main>
    </div>
  )
}