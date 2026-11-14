/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Logs errors and displays a friendly fallback UI
 */

import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PrimaryButton } from './PrimaryButton'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null })
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center animate-in slide-up">
          <div className="w-16 h-16 rounded-full bg-sl-error/10 flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-sl-error" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold text-sl-text-primary mb-3">Something went wrong</h2>
          <p className="text-sl-text-secondary mb-6 max-w-md">
            We encountered an unexpected error while loading the registration form.
            Please try again or navigate back to the homepage.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <PrimaryButton
              variant="primary"
              size="md"
              fullWidth={true}
              onClick={this.handleRetry}
            >
              <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
              Try Again
            </PrimaryButton>
            <Link to="/" className="btn-secondary">
              <Home className="w-4 h-4 mr-2" aria-hidden="true" />
              Go Home
            </Link>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <details className="mt-8 w-full max-w-md text-left">
              <summary className="cursor-pointer text-sm text-sl-text-secondary hover:text-sl-text-primary">
                Error Details (Development)
              </summary>
              <pre className="mt-3 p-4 bg-sl-bg-input border border-sl-border rounded-lg text-xs text-sl-text-secondary overflow-auto">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}