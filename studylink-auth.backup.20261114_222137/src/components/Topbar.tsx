/**
 * Topbar Component
 * Top navigation bar with user menu, notifications, and logout
 */

import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  Sun,
  LogOut,
  User,
  Settings,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/utils'
import { useAuth } from '@/hooks/useAuth'

export function Topbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 bg-sl-bg-card/80 backdrop-blur-lg border-b border-sl-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left side - page title placeholder */}
        <div className="flex-1 lg:hidden" />

        {/* Center - Notifications (desktop) */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-center">
          <div className="relative" ref={notificationsRef}>
            <button
              className={cn(
                'relative p-2 rounded-xl text-sl-text-secondary',
                'hover:text-sl-text-primary hover:bg-sl-bg-secondary transition-colors',
                showNotifications && 'text-sl-accent-primary bg-sl-accent-primary/10'
              )}
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowUserMenu(false)
              }}
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-sl-error text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-sl-bg-card border border-sl-border rounded-xl shadow-card overflow-hidden animate-in slide-down">
                <div className="p-4 border-b border-sl-border flex items-center justify-between">
                  <h3 className="font-semibold text-sl-text-primary">Notifications</h3>
                  <button className="text-sm text-sl-accent-primary hover:underline">Mark all read</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {[
                    { title: 'New session request', desc: 'John Doe requested a session for Calculus', time: '5 min ago', unread: true },
                    { title: 'Session confirmed', desc: 'Your session with Jane Smith is confirmed for tomorrow 2PM', time: '1 hour ago', unread: true },
                    { title: 'New tutor available', desc: 'Dr. Martinez is now available for Physics tutoring', time: '3 hours ago', unread: false },
                  ].map((notif, i) => (
                    <button
                      key={i}
                      className={cn(
                        'w-full p-4 text-left hover:bg-sl-bg-secondary transition-colors border-b border-sl-border/50 last:border-0',
                        notif.unread && 'bg-sl-accent-primary/5'
                      )}
                    >
                      <p className="font-medium text-sl-text-primary">{notif.title}</p>
                      <p className="text-sm text-sl-text-secondary mt-1">{notif.desc}</p>
                      <p className="text-xs text-sl-text-muted mt-2">{notif.time}</p>
                    </button>
                  ))}
                </div>
                <div className="p-3 border-t border-sl-border">
                  <Link
                    to="/notifications"
                    className="block text-center text-sm text-sl-accent-primary hover:underline"
                    onClick={() => setShowNotifications(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Theme toggle & User menu */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            className={cn(
              'p-2 rounded-xl text-sl-text-secondary',
              'hover:text-sl-text-primary hover:bg-sl-bg-secondary transition-colors'
            )}
            aria-label="Toggle theme"
          >
            <Sun className="w-5 h-5" />
          </button>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              className={cn(
                'flex items-center gap-2 p-1.5 pr-3 rounded-xl',
                'hover:bg-sl-bg-secondary transition-colors',
                showUserMenu && 'bg-sl-accent-primary/10'
              )}
              onClick={() => {
                setShowUserMenu(!showUserMenu)
                setShowNotifications(false)
              }}
              aria-label="User menu"
              aria-expanded={showUserMenu}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-full bg-sl-accent-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-sl-accent-primary" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-sl-text-primary truncate max-w-[150px]">{user?.fullName}</p>
                <p className="text-xs text-sl-text-secondary capitalize">{user?.role}</p>
              </div>
              <ChevronDown className={cn('w-4 h-4 text-sl-text-secondary transition-transform', showUserMenu && 'rotate-180')} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-sl-bg-card border border-sl-border rounded-xl shadow-card overflow-hidden animate-in slide-down">
                <div className="p-3 border-b border-sl-border">
                  <p className="font-medium text-sl-text-primary">{user?.fullName}</p>
                  <p className="text-sm text-sl-text-secondary">{user?.email}</p>
                  <p className="text-xs text-sl-text-muted capitalize">{user?.role} • {user?.course}</p>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-sl-text-secondary hover:text-sl-text-primary hover:bg-sl-bg-secondary transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-sl-text-secondary hover:text-sl-text-primary hover:bg-sl-bg-secondary transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <hr className="my-2 border-sl-border" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-sl-error hover:bg-sl-error/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}