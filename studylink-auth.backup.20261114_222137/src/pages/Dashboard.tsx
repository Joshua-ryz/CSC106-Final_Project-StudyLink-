/**
 * Dashboard Page
 * Role-based dashboard home with summary cards, upcoming sessions, and quick actions
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  Plus,
  BookOpen,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { cn, formatDate, formatTime } from '@/utils'

interface StatCard {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: string
  trendUp?: boolean
  color: string
}

interface Session {
  id: string
  subject: string
  topic?: string
  tutorName?: string
  studentName?: string
  scheduledAt: string
  duration: number
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED'
  role: 'tutor' | 'student'
}

interface TutorRequest {
  id: string
  studentName: string
  subject: string
  topic?: string
  scheduledAt: string
  duration: number
  message?: string
}

export function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<StatCard[]>([])
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
  const [tutorRequests, setTutorRequests] = useState<TutorRequest[]>([])
  const [loading, setLoading] = useState(true)

  const userRole = user?.role || 'tutee'

  // Mock data - replace with API calls later
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Role-based stats
      if (userRole === 'tutee') {
        setStats([
          {
            title: 'Upcoming Sessions',
            value: 3,
            icon: <Calendar className="w-6 h-6" />,
            color: 'bg-sl-accent-primary/20 text-sl-accent-primary',
          },
          {
            title: 'Available Tutors',
            value: 12,
            icon: <Users className="w-6 h-6" />,
            color: 'bg-sl-success/20 text-sl-success',
          },
          {
            title: 'Sessions Completed',
            value: 8,
            icon: <CheckCircle className="w-6 h-6" />,
            trend: '+2 this month',
            trendUp: true,
            color: 'bg-sl-accent-secondary/20 text-sl-accent-secondary',
          },
          {
            title: 'Total Hours',
            value: '24h',
            icon: <Clock className="w-6 h-6" />,
            color: 'bg-sl-warning/20 text-sl-warning',
          },
        ])

        setUpcomingSessions([
          {
            id: '1',
            subject: 'Calculus I',
            topic: 'Derivatives & Limits',
            tutorName: 'Dr. Sarah Martinez',
            scheduledAt: new Date(Date.now() + 86400000).toISOString(),
            duration: 60,
            status: 'ACCEPTED',
            role: 'student',
          },
          {
            id: '2',
            subject: 'Physics',
            topic: 'Newton\'s Laws',
            tutorName: 'Prof. James Chen',
            scheduledAt: new Date(Date.now() + 172800000).toISOString(),
            duration: 90,
            status: 'PENDING',
            role: 'student',
          },
          {
            id: '3',
            subject: 'Chemistry',
            topic: 'Organic Chemistry Basics',
            tutorName: 'Maria Santos',
            scheduledAt: new Date(Date.now() + 259200000).toISOString(),
            duration: 60,
            status: 'ACCEPTED',
            role: 'student',
          },
        ])
      } else if (userRole === 'tutor') {
        setStats([
          {
            title: 'Pending Requests',
            value: 5,
            icon: <BookOpen className="w-6 h-6" />,
            color: 'bg-sl-warning/20 text-sl-warning',
          },
          {
            title: 'Upcoming Sessions',
            value: 4,
            icon: <Calendar className="w-6 h-6" />,
            color: 'bg-sl-accent-primary/20 text-sl-accent-primary',
          },
          {
            title: 'Students Helped',
            value: 23,
            icon: <Users className="w-6 h-6" />,
            trend: '+5 this month',
            trendUp: true,
            color: 'bg-sl-success/20 text-sl-success',
          },
          {
            title: 'Average Rating',
            value: '4.8',
            icon: <Star className="w-6 h-6" />,
            color: 'bg-sl-accent-secondary/20 text-sl-accent-secondary',
          },
        ])

        setUpcomingSessions([
          {
            id: '1',
            subject: 'Calculus I',
            topic: 'Derivatives & Limits',
            studentName: 'Alex Johnson',
            scheduledAt: new Date(Date.now() + 86400000).toISOString(),
            duration: 60,
            status: 'ACCEPTED',
            role: 'tutor',
          },
          {
            id: '2',
            subject: 'Physics',
            topic: 'Thermodynamics',
            studentName: 'Sam Wilson',
            scheduledAt: new Date(Date.now() + 172800000).toISOString(),
            duration: 90,
            status: 'PENDING',
            role: 'tutor',
          },
        ])

        setTutorRequests([
          {
            id: '1',
            studentName: 'Emma Davis',
            subject: 'Chemistry',
            topic: 'Periodic Trends',
            scheduledAt: new Date(Date.now() + 432000000).toISOString(),
            duration: 60,
            message: 'Struggling with electron configurations',
          },
          {
            id: '2',
            studentName: 'Mike Chen',
            subject: 'Biology',
            topic: 'Cell Division',
            scheduledAt: new Date(Date.now() + 518400000).toISOString(),
            duration: 90,
            message: 'Need help with mitosis stages',
          },
        ])
      } else {
        // Both role - combined stats
        setStats([
          {
            title: 'Upcoming Sessions',
            value: 5,
            icon: <Calendar className="w-6 h-6" />,
            color: 'bg-sl-accent-primary/20 text-sl-accent-primary',
          },
          {
            title: 'Pending Requests',
            value: 3,
            icon: <BookOpen className="w-6 h-6" />,
            color: 'bg-sl-warning/20 text-sl-warning',
          },
          {
            title: 'Sessions Completed',
            value: 15,
            icon: <CheckCircle className="w-6 h-6" />,
            trend: '+3 this month',
            trendUp: true,
            color: 'bg-sl-success/20 text-sl-success',
          },
          {
            title: 'Average Rating',
            value: '4.7',
            icon: <Star className="w-6 h-6" />,
            color: 'bg-sl-accent-secondary/20 text-sl-accent-secondary',
          },
        ])

        setUpcomingSessions([
          {
            id: '1',
            subject: 'Calculus I',
            topic: 'Derivatives',
            tutorName: 'Dr. Sarah Martinez',
            scheduledAt: new Date(Date.now() + 86400000).toISOString(),
            duration: 60,
            status: 'ACCEPTED',
            role: 'student',
          },
          {
            id: '2',
            subject: 'Physics',
            topic: 'Mechanics',
            studentName: 'Alex Johnson',
            scheduledAt: new Date(Date.now() + 172800000).toISOString(),
            duration: 90,
            status: 'ACCEPTED',
            role: 'tutor',
          },
        ])

        setTutorRequests([
          {
            id: '1',
            studentName: 'Emma Davis',
            subject: 'Chemistry',
            topic: 'Periodic Trends',
            scheduledAt: new Date(Date.now() + 432000000).toISOString(),
            duration: 60,
            message: 'Struggling with electron configurations',
          },
        ])
      }

      setLoading(false)
    }

    loadDashboardData()
  }, [userRole])

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-sl-success/20 text-sl-success'
      case 'PENDING':
        return 'bg-sl-warning/20 text-sl-warning'
      case 'DECLINED':
      case 'CANCELLED':
        return 'bg-sl-error/20 text-sl-error'
      case 'COMPLETED':
        return 'bg-sl-accent-secondary/20 text-sl-accent-secondary'
      default:
        return 'bg-sl-border text-sl-text-secondary'
    }
  }

  const getRoleBasedQuickActions = () => {
    if (userRole === 'tutee') {
      return [
        { label: 'Find a Tutor', href: '/find-tutor', icon: <Users className="w-5 h-5" />, primary: true },
        { label: 'Book a Session', href: '/book-session', icon: <Plus className="w-5 h-5" />, primary: false },
        { label: 'View All Sessions', href: '/my-sessions', icon: <Calendar className="w-5 h-5" />, primary: false },
      ]
    } else if (userRole === 'tutor') {
      return [
        { label: 'Manage Availability', href: '/my-availability', icon: <Calendar className="w-5 h-5" />, primary: true },
        { label: 'View Requests', href: '/tutor-requests', icon: <BookOpen className="w-5 h-5" />, primary: false },
        { label: 'View All Sessions', href: '/my-sessions', icon: <Calendar className="w-5 h-5" />, primary: false },
      ]
    } else {
      return [
        { label: 'Find a Tutor', href: '/find-tutor', icon: <Users className="w-5 h-5" />, primary: true },
        { label: 'Manage Availability', href: '/my-availability', icon: <Calendar className="w-5 h-5" />, primary: false },
        { label: 'View Requests', href: '/tutor-requests', icon: <BookOpen className="w-5 h-5" />, primary: false },
        { label: 'View All Sessions', href: '/my-sessions', icon: <Calendar className="w-5 h-5" />, primary: false },
      ]
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-sl-accent-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sl-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in slide-up">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-sl-text-primary">
            Welcome back, {user?.fullName?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-sl-text-secondary mt-1">
            Here's what's happening with your {userRole === 'tutor' ? 'tutoring' : userRole === 'both' ? 'learning & tutoring' : 'learning'} journey.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            'px-3 py-1 rounded-full text-sm font-medium capitalize',
            userRole === 'tutee' && 'bg-sl-accent-primary/20 text-sl-accent-primary',
            userRole === 'tutor' && 'bg-sl-success/20 text-sl-success',
            userRole === 'both' && 'bg-sl-warning/20 text-sl-warning'
          )}>
            {userRole}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-card-hover transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-sl-text-secondary">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-sl-text-primary">{stat.value}</p>
                  {stat.trend && (
                    <p className={cn('mt-1 text-xs font-medium flex items-center gap-1', stat.trendUp ? 'text-sl-success' : 'text-sl-error')}>
                      <TrendingUp className={cn('w-3 h-3', stat.trendUp ? '' : 'rotate-180')} />
                      {stat.trend}
                    </p>
                  )}
                </div>
                <div className={cn('p-3 rounded-xl', stat.color)}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-sl-text-primary">Upcoming Sessions</h2>
            <Link to="/my-sessions" className="text-sm text-sl-accent-primary hover:underline flex items-center gap-1">
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <Card>
            <CardContent className="p-0">
              {upcomingSessions.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-sl-border mx-auto mb-4" />
                  <p className="text-sl-text-secondary">No upcoming sessions</p>
                  <p className="text-sm text-sl-text-muted mt-1">Book your first session to get started!</p>
                  <Button className="mt-4" asChild>
                    <Link to="/book-session">Book a Session</Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-sl-border">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="p-4 hover:bg-sl-bg-secondary/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', session.role === 'tutor' ? 'bg-sl-success/20 text-sl-success' : 'bg-sl-accent-primary/20 text-sl-accent-primary')}>
                            {session.role === 'tutor' ? <Users className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                          </div>
                          <div>
                            <p className="font-medium text-sl-text-primary">{session.subject}</p>
                            {session.topic && <p className="text-sm text-sl-text-secondary">{session.topic}</p>}
                            <p className={cn('text-xs font-medium mt-1 px-2 py-0.5 rounded-full', getStatusColor(session.status))}>
                              {session.status}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-sl-text-secondary">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(session.scheduledAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(session.scheduledAt)} • {session.duration}min</span>
                          </div>
                          {session.role === 'student' && session.tutorName && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>with {session.tutorName}</span>
                            </div>
                          )}
                          {session.role === 'tutor' && session.studentName && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>with {session.studentName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tutor Requests / Quick Actions Sidebar */}
        <div className="space-y-6">
          {userRole === 'tutor' || userRole === 'both' ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-sl-text-primary">Tutor Requests</h2>
                <Link to="/tutor-requests" className="text-sm text-sl-accent-primary hover:underline flex items-center gap-1">
                  View all
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <Card>
                <CardContent className="p-0">
                  {tutorRequests.length === 0 ? (
                    <div className="p-8 text-center">
                      <BookOpen className="w-12 h-12 text-sl-border mx-auto mb-4" />
                      <p className="text-sl-text-secondary">No pending requests</p>
                      <p className="text-sm text-sl-text-muted mt-1">New session requests will appear here</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-sl-border">
                      {tutorRequests.map((request) => (
                        <div key={request.id} className="p-4 hover:bg-sl-bg-secondary/50 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-sl-warning/20 text-sl-warning flex items-center justify-center flex-shrink-0">
                              <BookOpen className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sl-text-primary">{request.studentName}</p>
                              <p className="text-sm text-sl-text-secondary">{request.subject}</p>
                              {request.topic && <p className="text-xs text-sl-text-muted mt-1">{request.topic}</p>}
                              <div className="flex items-center gap-3 mt-2 text-xs text-sl-text-muted">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(request.scheduledAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {request.duration}min
                                </span>
                              </div>
                              {request.message && (
                                <p className="text-xs text-sl-text-muted mt-2 line-clamp-1">{request.message}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="primary" className="flex-1">
                              Accept
                            </Button>
                            <Button size="sm" variant="secondary" className="flex-1">
                              Decline
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Quick Actions for Tutee */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getRoleBasedQuickActions().map((action, index) => (
                    <Button
                      key={index}
                      asChild
                      variant={action.primary ? 'primary' : 'secondary'}
                      className="w-full justify-start gap-3"
                    >
                      <Link to={action.href}>
                        <span className="flex-shrink-0 w-5 h-5">{action.icon}</span>
                        {action.label}
                      </Link>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Need to import User icon for the session cards
import { User } from 'lucide-react'