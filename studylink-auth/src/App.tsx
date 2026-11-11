/**
 * Main App Component
 * Routing configuration for StudyLink authentication
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './components/ui/toaster'
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import { ForgotPassword } from './pages/ForgotPassword'

// Placeholder for dashboard - will be implemented later
function Dashboard() {
  return (
    <div className="min-h-screen bg-sl-bg-main flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold text-sl-text-primary mb-4">Dashboard</h1>
        <p className="text-sl-text-secondary">Welcome to StudyLink Dashboard</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <ToastProvider>
      <Routes>
        {/* Public routes (require NO authentication) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Protected routes (require authentication) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Future routes will go here */}
        </Route>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ToastProvider>
  )
}

export default App