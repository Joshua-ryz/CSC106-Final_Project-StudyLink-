/**
 * Settings Page
 * Account settings, preferences, and danger zone
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  Lock,
  Bell,
  Moon,
  Sun,
  Monitor,
  Globe,
  Trash2,
  AlertTriangle,
  Shield,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/utils'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '@/components/ui/toaster'
import { useNavigate } from 'react-router-dom'

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type PasswordFormData = z.infer<typeof passwordSchema>

export function Settings() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [activeSection, setActiveSection] = useState<'account' | 'preferences' | 'danger'>('account')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false)

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const handlePasswordSubmit = async (_data: PasswordFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully.',
        variant: 'success',
        onClose: () => {},
      })
      resetPassword()
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Current password is incorrect.',
        variant: 'error',
        onClose: () => {},
      })
    }
  }

  const handleRevokeSessions = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: 'Sessions Revoked',
        description: 'All your active sessions have been logged out.',
        variant: 'success',
        onClose: () => {},
      })
      setShowRevokeConfirm(false)
    } catch (error) {
      toast({
        title: 'Failed',
        description: 'Something went wrong.',
        variant: 'error',
        onClose: () => {},
      })
    }
  }

  const handleDeleteAccount = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      await logout()
      toast({
        title: 'Account Deleted',
        description: 'Your account has been permanently deleted.',
        variant: 'success',
        onClose: () => {},
      })
      navigate('/login')
    } catch (error) {
      toast({
        title: 'Failed',
        description: 'Something went wrong.',
        variant: 'error',
        onClose: () => {},
      })
    }
  }

  const sections = [
    { id: 'account', label: 'Account', icon: <User className="w-5 h-5" /> },
    { id: 'preferences', label: 'Preferences', icon: <Shield className="w-5 h-5" /> },
    { id: 'danger', label: 'Danger Zone', icon: <AlertTriangle className="w-5 h-5" /> },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in slide-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-sl-text-primary">Settings</h1>
        <p className="text-sl-text-secondary mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Section Navigation */}
      <Card>
        <CardContent className="p-2">
          <div className="flex gap-1" role="tablist">
            {sections.map((section) => (
              <button
                key={section.id}
                role="tab"
                aria-selected={activeSection === section.id}
                onClick={() => setActiveSection(section.id as typeof activeSection)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  activeSection === section.id
                    ? 'bg-sl-accent-primary text-white shadow-glow-primary'
                    : 'text-sl-text-secondary hover:text-sl-text-primary hover:bg-sl-bg-secondary'
                )}
              >
                {section.icon}
                {section.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Section */}
      {activeSection === 'account' && (
        <div className="space-y-6">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input value={user?.fullName} disabled className="bg-sl-bg-secondary" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={user?.email} disabled className="bg-sl-bg-secondary" />
                </div>
                <div>
                  <Label>Course</Label>
                  <Input value={user?.course} disabled className="bg-sl-bg-secondary" />
                </div>
                <div>
                  <Label>Role</Label>
                  <Input
                    value={user?.role === 'seeker' ? 'Seeker' : user?.role === 'tutor' ? 'Tutor' : 'Both'}
                    disabled
                    className="bg-sl-bg-secondary"
                  />
                </div>
              </div>
              <Link
                to="/profile"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold rounded-xl bg-sl-bg-secondary text-sl-text-primary border border-sl-border hover:bg-sl-bg-input hover:border-sl-accent-primary/50 hover:text-sl-accent-primary active:scale-[0.98] transition-all duration-200"
              >
                Edit Profile
              </Link>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPassword(handlePasswordSubmit)} className="space-y-4" noValidate>
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...registerPassword('currentPassword')}
                    autoComplete="current-password"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-sl-error">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...registerPassword('newPassword')}
                    autoComplete="new-password"
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-sl-error">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...registerPassword('confirmPassword')}
                    autoComplete="new-password"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-sl-error">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="submit" loading={isPasswordSubmitting}>
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Email Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'sessionRequests', label: 'Session Requests', desc: 'Get notified when students request sessions' },
                { id: 'sessionUpdates', label: 'Session Updates', desc: 'Get notified when sessions are accepted, declined, or cancelled' },
                { id: 'sessionReminders', label: 'Session Reminders', desc: 'Get reminded 1 hour before upcoming sessions' },
                { id: 'marketing', label: 'Marketing Emails', desc: 'Receive updates about new features and tips' },
              ].map((notif) => (
                <div key={notif.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sl-text-primary">{notif.label}</p>
                    <p className="text-sm text-sl-text-secondary">{notif.desc}</p>
                  </div>
                  <Checkbox id={notif.id} defaultChecked={notif.id !== 'marketing'} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Preferences Section */}
      {activeSection === 'preferences' && (
        <div className="space-y-6">
          {/* Theme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sl-text-secondary mb-4">Choose your preferred color theme</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'dark', label: 'Dark', icon: <Moon className="w-6 h-6" />, desc: 'Always use dark mode' },
                  { id: 'light', label: 'Light', icon: <Sun className="w-6 h-6" />, desc: 'Always use light mode' },
                  { id: 'system', label: 'System', icon: <Monitor className="w-6 h-6" />, desc: 'Match system preference' },
                ].map((theme) => (
                  <button
                    key={theme.id}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all duration-200 text-left',
                      'hover:border-sl-accent-primary/50 hover:bg-sl-bg-secondary',
                      activeSection === 'preferences' ? 'border-sl-border' : 'border-sl-accent-primary bg-sl-accent-primary/10'
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-sl-bg-input flex items-center justify-center text-sl-text-secondary">
                        {theme.icon}
                      </div>
                    </div>
                    <p className="font-medium text-sl-text-primary">{theme.label}</p>
                    <p className="text-sm text-sl-text-secondary">{theme.desc}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Language
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sl-text-primary">English</p>
                  <p className="text-sm text-sl-text-secondary">More languages coming soon</p>
                </div>
                <Button variant="secondary" size="sm" disabled>
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Danger Zone Section */}
      {activeSection === 'danger' && (
        <div className="space-y-6">
          {/* Revoke Sessions */}
          <Card className="border-sl-warning/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sl-warning">
                <AlertTriangle className="w-5 h-5" />
                Revoke All Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sl-text-secondary">
                  This will log you out of all devices and revoke all active sessions.
                  You'll need to log in again on each device.
                </p>
              </div>
              <Button variant="secondary" onClick={() => setShowRevokeConfirm(true)}>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Revoke All Sessions
              </Button>
            </CardContent>
          </Card>

          {/* Delete Account */}
          <Card className="border-sl-error/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sl-error">
                <Trash2 className="w-5 h-5" />
                Delete Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sl-text-secondary">
                  Permanently delete your account and all associated data. This action cannot be undone.
                  All your sessions, ratings, and profile information will be lost forever.
                </p>
              </div>
              <Button variant="secondary" className="bg-sl-error/10 text-sl-error hover:bg-sl-error/20 border-sl-error/30" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete My Account
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Revoke Sessions Modal */}
      {showRevokeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sl-warning">
                <AlertTriangle className="w-5 h-5" />
                Revoke All Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sl-text-secondary">
                Are you sure you want to revoke all active sessions? You will be logged out of all devices.
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setShowRevokeConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="secondary" className="bg-sl-error/10 text-sl-error hover:bg-sl-error/20 border-sl-error/30 flex-1" onClick={handleRevokeSessions}>
                  Revoke All Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sl-error">
                <Trash2 className="w-5 h-5" />
                Delete Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sl-text-secondary">
                This action is irreversible. Your account, sessions, ratings, and all data will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="secondary" className="bg-sl-error/10 text-sl-error hover:bg-sl-error/20 border-sl-error/30 flex-1" onClick={handleDeleteAccount}>
                  Delete My Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}