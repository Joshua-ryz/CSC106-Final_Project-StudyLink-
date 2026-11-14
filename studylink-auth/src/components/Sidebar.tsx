/**
 * Sidebar Component
 * Collapsible navigation sidebar with role-based menu items
 */

import { useState } from 'react'
import { Link, useLocation, NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CalendarPlus,
  Clock,
  BookOpen,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/utils'
import { useAuth } from '@/hooks/useAuth'

import { UserRole } from '@/types/auth'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  roles: UserRole[]
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['seeker', 'tutor', 'both'],
  },
  {
    label: 'Find Tutor',
    href: '/find-tutor',
    icon: <Users className="w-5 h-5" />,
    roles: ['seeker', 'both'],
  },
  {
    label: 'Book Session',
    href: '/book-session',
    icon: <CalendarPlus className="w-5 h-5" />,
    roles: ['seeker', 'both'],
  },
  {
    label: 'My Sessions',
    href: '/my-sessions',
    icon: <Clock className="w-5 h-5" />,
    roles: ['seeker', 'tutor', 'both'],
  },
  {
    label: 'Tutor Requests',
    href: '/tutor-requests',
    icon: <BookOpen className="w-5 h-5" />,
    roles: ['tutor', 'both'],
  },
  {
    label: 'My Availability',
    href: '/my-availability',
    icon: <CalendarPlus className="w-5 h-5" />,
    roles: ['tutor', 'both'],
  },
  {
    label: 'My Profile',
    href: '/profile',
    icon: <User className="w-5 h-5" />,
    roles: ['seeker', 'tutor', 'both'],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
    roles: ['seeker', 'tutor', 'both'],
  },
]

export function Sidebar() {
  const { user } = useAuth()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const userRole: UserRole = user?.role || 'seeker'
  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole))

  const toggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  return (
    <>
      {/* Mobile menu button - only visible on mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 btn-primary p-2"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 bg-sl-bg-card border-r border-sl-border transition-all duration-300 flex flex-col',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Main navigation"
      >
        {/* Logo/Brand */}
        <div className={cn('flex items-center justify-between h-16 px-4 border-b border-sl-border', collapsed && 'justify-center')}>
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center gap-2" aria-label="StudyLink Dashboard">
              <div className="w-8 h-8 rounded-xl bg-sl-accent-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-sl-text-primary">StudyLink</span>
            </Link>
          )}
          {collapsed && (
            <Link to="/dashboard" className="flex items-center justify-center" aria-label="StudyLink Dashboard">
              <div className="w-8 h-8 rounded-xl bg-sl-accent-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
            </Link>
          )}

          {/* Collapse toggle - hidden on mobile */}
          <button
            className={cn(
              'p-1.5 rounded-lg text-sl-text-secondary hover:text-sl-text-primary hover:bg-sl-bg-secondary transition-colors',
              'lg:flex hidden'
            )}
            onClick={toggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          {/* Close button - mobile only */}
          <button
            className={cn(
              'lg:hidden p-1.5 rounded-lg text-sl-text-secondary hover:text-sl-text-primary hover:bg-sl-bg-secondary transition-colors'
            )}
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1" role="navigation" aria-label="Main navigation">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive: active }) => cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-sl-accent-primary focus:ring-offset-2 focus:ring-offset-sl-bg-main',
                  active
                    ? 'bg-sl-accent-primary/10 text-sl-accent-primary'
                    : 'text-sl-text-secondary hover:text-sl-text-primary hover:bg-sl-bg-secondary',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.label : undefined}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <span className={cn('flex-shrink-0', collapsed && 'w-5 h-5')}>{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            )
          })}
        </nav>

        {/* User info at bottom - only when not collapsed */}
        {!collapsed && (
          <div className="p-3 border-t border-sl-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sl-accent-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-sl-accent-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sl-text-primary truncate">{user?.fullName}</p>
                <p className="text-xs text-sl-text-secondary capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}