/**
 * Toast/Toaster Components
 * Simple toast notification system
 */

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils'

interface ToastProps {
  title: string
  description?: string
  variant?: 'default' | 'success' | 'error' | 'warning'
  onClose: () => void
}

function Toast({ title, description, variant = 'default', onClose }: ToastProps) {
  const variants = {
    default: 'bg-sl-bg-card border-sl-border',
    success: 'bg-sl-success/10 border-sl-success/30',
    error: 'bg-sl-error/10 border-sl-error/30',
    warning: 'bg-yellow-500/10 border-yellow-500/30',
  }

  const icons = {
    default: <svg className="w-5 h-5 text-sl-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    success: <svg className="w-5 h-5 text-sl-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    error: <svg className="w-5 h-5 text-sl-error" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    warning: <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex items-start gap-3 w-full max-w-sm p-4 rounded-xl border shadow-lg animate-in slide-up',
        variants[variant]
      )}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{icons[variant]}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sl-text-primary">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-sl-text-secondary">{description}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded-lg text-sl-text-secondary hover:text-sl-text-primary hover:bg-sl-bg-input transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

interface ToasterProps {
  toasts: Array<ToastProps & { id: string }>
  onClose: (id: string) => void
}

export function Toaster({ toasts, onClose }: ToasterProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={() => onClose(toast.id)} />
        </div>
      ))}
    </div>
  )
}

// Toast context for global access
interface ToastContextType {
  toasts: Array<ToastProps & { id: string }>
  toast: (props: ToastProps) => string
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Array<ToastProps & { id: string }>>([])

  const toast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts(prev => [...prev, { ...props, id }])
    return id
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <Toaster toasts={toasts} onClose={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}