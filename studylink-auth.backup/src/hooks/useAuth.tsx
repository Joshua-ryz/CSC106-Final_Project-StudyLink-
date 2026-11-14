/**
 * Authentication Context and Hook
 * Manages global authentication state
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { User, AuthState } from '@/types/auth'
import { getCurrentUser, logout as logoutApi } from '@/services/authService'

interface AuthContextType extends AuthState {
  login: (user: User) => void
  logout: () => Promise<void>
  updateUser: (user: Partial<User>) => void
  clearError: () => void
  setLoading: (loading: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  // Initialize auth state on mount
  useEffect(() => {
    initAuth()
  }, [])

  const initAuth = async () => {
    try {
      const user = await getCurrentUser()
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      // Not authenticated or token expired
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    }
  }

  const login = useCallback((user: User) => {
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    })
  }, [])

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }))
    try {
      await logoutApi()
    } finally {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    }
  }, [])

  const updateUser = useCallback((userData: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : null,
    }))
  }, [])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }))
  }, [])

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
    clearError,
    setLoading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}