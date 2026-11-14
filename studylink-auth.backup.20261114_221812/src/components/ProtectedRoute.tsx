/**
 * ProtectedRoute Component
 * Wrapper for routes that require authentication
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sl-bg-main">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-sl-accent-primary animate-spin" />
          <p className="text-sl-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sl-bg-main">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-sl-accent-primary animate-spin" />
          <p className="text-sl-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}