/**
 * Main App Component
 * Routing configuration for StudyLink authentication and dashboard
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './components/ui/toaster'
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute'
import { DashboardLayout } from './components/DashboardLayout'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import { ForgotPassword } from './pages/ForgotPassword'
import { Dashboard } from './pages/Dashboard'
import { FindTutor } from './pages/FindTutor'
import { BookSession } from './pages/BookSession'
import { MySessions } from './pages/MySessions'
import { TutorRequests } from './pages/TutorRequests'
import { MyAvailability } from './pages/MyAvailability'
import { Profile } from './pages/Profile'
import { Settings } from './pages/Settings'

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

        {/* Protected routes (require authentication) - using DashboardLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/find-tutor" element={<FindTutor />} />
            <Route path="/book-session" element={<BookSession />} />
            <Route path="/my-sessions" element={<MySessions />} />
            <Route path="/tutor-requests" element={<TutorRequests />} />
            <Route path="/my-availability" element={<MyAvailability />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ToastProvider>
  )
}

export default App