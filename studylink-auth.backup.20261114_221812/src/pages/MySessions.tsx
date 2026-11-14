/**
 * My Sessions Page
 * Tabbed view of upcoming, past, and cancelled sessions
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Filter,
  BookOpen,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, formatDate, formatTime } from '@/utils'

type SessionStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED'
type Tab = 'upcoming' | 'past' | 'cancelled'

interface Session {
  id: string
  subject: string
  topic?: string
  tutorName?: string
  studentName?: string
  tutorId?: string
  studentId?: string
  scheduledAt: string
  duration: number
  status: SessionStatus
  role: 'tutor' | 'student'
  rating?: number
  review?: string
  meetingType: 'online' | 'in-person'
  location?: string
  meetingLink?: string
}

const mockSessions: Session[] = [
  {
    id: '1',
    subject: 'Calculus I',
    topic: 'Derivatives & Limits',
    tutorName: 'Dr. Sarah Martinez',
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    duration: 60,
    status: 'ACCEPTED',
    role: 'student',
    meetingType: 'online',
    meetingLink: 'https://meet.studylink.com/session-1',
  },
  {
    id: '2',
    subject: 'Physics',
    topic: 'Thermodynamics',
    tutorName: 'Prof. James Chen',
    scheduledAt: new Date(Date.now() + 172800000).toISOString(),
    duration: 90,
    status: 'PENDING',
    role: 'student',
    meetingType: 'in-person',
    location: 'Library Study Room 3',
  },
  {
    id: '3',
    subject: 'Chemistry',
    topic: 'Organic Chemistry Basics',
    tutorName: 'Maria Santos',
    scheduledAt: new Date(Date.now() - 86400000).toISOString(),
    duration: 60,
    status: 'COMPLETED',
    role: 'student',
    rating: 5,
    review: 'Great explanation of reaction mechanisms!',
    meetingType: 'online',
  },
  {
    id: '4',
    subject: 'Biology',
    topic: 'Cell Division',
    studentName: 'Alex Johnson',
    scheduledAt: new Date(Date.now() + 259200000).toISOString(),
    duration: 90,
    status: 'ACCEPTED',
    role: 'tutor',
    meetingType: 'online',
    meetingLink: 'https://meet.studylink.com/session-4',
  },
  {
    id: '5',
    subject: 'Statistics',
    topic: 'Probability Distributions',
    studentName: 'Sam Wilson',
    scheduledAt: new Date(Date.now() - 172800000).toISOString(),
    duration: 60,
    status: 'COMPLETED',
    role: 'tutor',
    rating: 4,
    review: 'Student was well prepared.',
    meetingType: 'in-person',
    location: 'Cafeteria',
  },
  {
    id: '6',
    subject: 'Linear Algebra',
    topic: 'Eigenvalues',
    tutorName: 'Dr. Robert Kim',
    scheduledAt: new Date(Date.now() - 259200000).toISOString(),
    duration: 60,
    status: 'CANCELLED',
    role: 'student',
    meetingType: 'online',
  },
]

const getStatusBadge = (status: SessionStatus) => {
  const variants: Record<SessionStatus, { variant: 'default' | 'success' | 'warning' | 'error' | 'secondary'; label: string }> = {
    PENDING: { variant: 'warning', label: 'Pending' },
    ACCEPTED: { variant: 'success', label: 'Accepted' },
    DECLINED: { variant: 'error', label: 'Declined' },
    CANCELLED: { variant: 'error', label: 'Cancelled' },
    COMPLETED: { variant: 'default', label: 'Completed' },
  }
  return variants[status]
}

const getStatusIcon = (status: SessionStatus) => {
  switch (status) {
    case 'PENDING':
      return <Clock className="w-4 h-4 text-sl-warning" />
    case 'ACCEPTED':
      return <CheckCircle className="w-4 h-4 text-sl-success" />
    case 'DECLINED':
    case 'CANCELLED':
      return <XCircle className="w-4 h-4 text-sl-error" />
    case 'COMPLETED':
      return <CheckCircle className="w-4 h-4 text-sl-accent-secondary" />
    default:
      return <Clock className="w-4 h-4 text-sl-text-muted" />
  }
}

export function MySessions() {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<SessionStatus | 'all'>('all')

  const tabs: { id: Tab; label: string; count: number }[] = [
    {
      id: 'upcoming',
      label: 'Upcoming',
      count: mockSessions.filter((s) => s.status === 'PENDING' || s.status === 'ACCEPTED').length,
    },
    {
      id: 'past',
      label: 'Past',
      count: mockSessions.filter((s) => s.status === 'COMPLETED').length,
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      count: mockSessions.filter((s) => s.status === 'CANCELLED' || s.status === 'DECLINED').length,
    },
  ]

  const filteredSessions = mockSessions
    .filter((session) => {
      const matchesTab = activeTab === 'upcoming'
        ? session.status === 'PENDING' || session.status === 'ACCEPTED'
        : activeTab === 'past'
        ? session.status === 'COMPLETED'
        : session.status === 'CANCELLED' || session.status === 'DECLINED'

      const matchesSearch = session.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (session.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (session.tutorName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (session.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

      const matchesFilter = filterStatus === 'all' || session.status === filterStatus

      return matchesTab && matchesSearch && matchesFilter
    })
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())

  return (
    <div className="space-y-6 animate-in slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-sl-text-primary">My Sessions</h1>
          <p className="text-sl-text-secondary mt-1">Manage and track all your tutoring sessions</p>
        </div>
        <Button asChild variant="primary">
          <Link to="/book-session">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Book New Session
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-2">
          <div className="flex gap-1" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-sl-accent-primary text-white shadow-glow-primary'
                    : 'text-sl-text-secondary hover:text-sl-text-primary hover:bg-sl-bg-secondary'
                )}
              >
                {tab.label}
                <span className={cn(
                  'px-2 py-0.5 text-xs rounded-full font-medium',
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-sl-bg-input text-sl-text-muted'
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sl-text-muted" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as SessionStatus | 'all')}
                className="input-field pl-10 appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="DECLINED">Declined</option>
              </select>
            </div>
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sl-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      <Card>
        <CardContent className="p-0">
          {filteredSessions.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-sl-border mx-auto mb-4" />
              <h3 className="text-lg font-medium text-sl-text-primary mb-2">
                {activeTab === 'upcoming' ? 'No upcoming sessions' : activeTab === 'past' ? 'No past sessions' : 'No cancelled sessions'}
              </h3>
              <p className="text-sl-text-secondary mb-6">
                {activeTab === 'upcoming' ? 'Book a session to get started!' : 'Your completed sessions will appear here'}
              </p>
              {activeTab === 'upcoming' && (
                <Button asChild variant="primary">
                  <Link to="/book-session">Book a Session</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-sl-border">
              {filteredSessions.map((session) => (
                <div key={session.id} className="p-4 hover:bg-sl-bg-secondary/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Session Info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                        session.role === 'tutor' ? 'bg-sl-success/20 text-sl-success' : 'bg-sl-accent-primary/20 text-sl-accent-primary'
                      )}>
                        {session.role === 'tutor' ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        ) : (
                          <BookOpen className="w-6 h-6" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sl-text-primary truncate">{session.subject}</h3>
                          <Badge variant={getStatusBadge(session.status).variant}>
                            {getStatusIcon(session.status)}
                            {getStatusBadge(session.status).label}
                          </Badge>
                        </div>
                        {session.topic && (
                          <p className="text-sm text-sl-text-secondary mt-1 truncate">{session.topic}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-sl-text-muted">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(session.scheduledAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(session.scheduledAt)} • {session.duration}min
                          </span>
                          <span className="flex items-center gap-1">
                            {session.meetingType === 'online' ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            )}
                            {session.meetingType === 'online' ? 'Online' : 'In-Person'}
                          </span>
                          {session.location && (
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {session.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 sm:ml-4">
                      {session.role === 'student' && session.tutorName && (
                        <span className="text-sm text-sl-text-secondary hidden sm:block">
                          with {session.tutorName}
                        </span>
                      )}
                      {session.role === 'tutor' && session.studentName && (
                        <span className="text-sm text-sl-text-secondary hidden sm:block">
                          with {session.studentName}
                        </span>
                      )}

                      {session.status === 'ACCEPTED' && session.meetingType === 'online' && session.meetingLink && (
                        <a
                          href={session.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary px-4 py-2 text-sm"
                        >
                          Join Session
                        </a>
                      )}

                      {session.status === 'ACCEPTED' && session.meetingType === 'in-person' && (
                        <Button variant="secondary" size="sm">
                          View Details
                        </Button>
                      )}

                      {session.status === 'PENDING' && (
                        <Button variant="secondary" size="sm">
                          View Request
                        </Button>
                      )}

                      {session.status === 'COMPLETED' && !session.rating && (
                        <Button variant="primary" size="sm" asChild>
                          <Link to={`/rate-session/${session.id}`}>
                            <Star className="w-4 h-4 mr-1 fill-current" />
                            Rate
                          </Link>
                        </Button>
                      )}

                      {session.status === 'COMPLETED' && session.rating && (
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-medium">{session.rating}</span>
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
  )
}

// Need to create Badge component