/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Logs errors to console and displays a friendly fallback UI
 */

import { Component, type ReactNode, type ErrorInfo } from 'react'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/utils'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error)
    console.error('Component stack:', errorInfo.componentStack)
  }

  handleRefresh = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, render it
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-sl-bg-main px-4">
          <div className="w-full max-w-md text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sl-error/20 mb-4">
                <RefreshCw className="w-8 h-8 text-sl-error" />
              </div>
              <h1 className="text-2xl font-bold text-sl-text-primary mb-2">
                Something went wrong
              </h1>
              <p className="text-sl-text-secondary mb-6">
                We encountered an unexpected error. The error has been logged for debugging.
              </p>
            </div>

            {/* Error details (only in development) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-sl-text-secondary hover:text-sl-text-primary">
                  Show error details (development only)
                </summary>
                <pre className="mt-3 p-4 bg-sl-bg-input border border-sl-border rounded-xl text-xs text-sl-text-secondary overflow-x-auto max-h-64">
                  {this.state.error.message}
                  {this.state.error.stack && '\n\n' + this.state.error.stack}
                </pre>
              </details>
            )}

            <button
              onClick={this.handleRefresh}
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 bg-sl-accent-primary text-white font-semibold rounded-xl',
                'transition-all duration-200',
                'hover:bg-sl-accent-primary/90 hover:shadow-glow-primary hover:-translate-y-0.5',
                'active:scale-[0.98] active:translate-y-0',
                'focus:ring-2 focus:ring-sl-accent-primary focus:ring-offset-2 focus:ring-offset-sl-bg-main'
              )}
            >
              <RefreshCw className="w-5 h-5" />
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook version for functional components (if needed)
 * Note: Error boundaries must be class components in React
 */