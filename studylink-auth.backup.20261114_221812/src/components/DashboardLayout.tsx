/**
 * DashboardLayout Component
 * Main layout wrapper for all dashboard pages
 * Includes Sidebar, Topbar, and main content area
 */

import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { cn } from '@/utils'

interface DashboardLayoutProps {
  className?: string
}

export function DashboardLayout({ className }: DashboardLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-sl-bg-main flex', className)}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0 transition-all duration-300">
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 xl:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}