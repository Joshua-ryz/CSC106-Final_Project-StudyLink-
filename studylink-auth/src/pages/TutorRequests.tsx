/**
 * Tutor Requests Page
 * View and manage incoming session requests (Tutor/Both only)
 */

import { useState } from 'react'
import {
  BookOpen,
  User,
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, formatDate, formatTime } from '@/utils'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/toaster'

interface TutorRequest {
  id: string
  studentName: string
  studentEmail: string
  studentAvatar?: string
  subject: string
  topic?: string
  scheduledAt: string
  duration: number
  message?: string
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED'
  meetingType: 'online' | 'in-person'
  location?: string
}

const mockRequests: TutorRequest[] = [
  {
    id: '1',
    studentName: 'Emma Davis',
    studentEmail: 'emma.davis@csu.edu.ph',
    subject: 'Chemistry',
    topic: 'Periodic Trends & Electron Configurations',
    scheduledAt: new Date(Date.now() + 432000000).toISOString(),
    duration: 60,
    message: 'Struggling with electron configurations and periodic trends. Have a quiz next week.',
    status: 'PENDING',
    meetingType: 'online',
  },
  {
    id: '2',
    studentName: 'Mike Chen',
    studentEmail: 'mike.chen@csu.edu.ph',
    subject: 'Biology',
    topic: 'Cell Division - Mitosis Stages',
    scheduledAt: new Date(Date.now() + 518400000).toISOString(),
    duration: 90,
    message: 'Need help understanding the stages of mitosis. Visual learner here!',
    status: 'PENDING',
    meetingType: 'in-person',
    location: 'Library Study Room 2',
  },
  {
    id: '3',
    studentName: 'Sarah Johnson',
    studentEmail: 'sarah.j@csu.edu.ph',
    subject: 'Calculus I',
    topic: 'Chain Rule Applications',
    scheduledAt: new Date(Date.now() - 86400000).toISOString(),
    duration: 60,
    message: 'Practice problems for chain rule.',
    status: 'ACCEPTED',
    meetingType: 'online',
  },
  {
    id: '4',
    studentName: 'Alex Rivera',
    studentEmail: 'alex.rivera@csu.edu.ph',
    subject: 'Physics',
    topic: 'Newton\'s Laws Problem Set',
    scheduledAt: new Date(Date.now() - 172800000).toISOString(),
    duration: 90,
    message: 'Stuck on the problem set for Newton\'s laws.',
    status: 'DECLINED',
    meetingType: 'in-person',
    location: 'Science Building Room 101',
  },
]

const getStatusConfig = (status: TutorRequest['status']) => {
  switch (status) {
    case 'PENDING':
      return { variant: 'warning' as const, label: 'Pending', icon: <Clock className="w-3 h-3" /> }
    case 'ACCEPTED':
      return { variant: 'success' as const, label: 'Accepted', icon: <CheckCircle className="w-3 h-3" /> }
    case 'DECLINED':
      return { variant: 'error' as const, label: 'Declined', icon: <XCircle className="w-3 h-3" /> }
  }
}

export function TutorRequests() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Check if user has tutor role
  if (user?.role !== 'tutor' && user?.role !== 'both') {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <BookOpen className="w-12 h-12 text-sl-border mx-auto mb-4" />
          <h3 className="text-lg font-medium text-sl-text-primary mb-2">Tutor Access Required</h3>
          <p className="text-sl-text-secondary mb-6">
            This page is only available for tutors. Switch your role to 'Tutor' or 'Both' in Settings to access tutor features.
          </p>
        </CardContent>
      </Card>
    )
  }

  const filteredRequests = mockRequests.filter((request) => {
    if (activeFilter === 'all') return true
    return request.status === activeFilter.toUpperCase()
  })

  const handleAccept = async (_requestId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    toast({
      title: 'Request Accepted',
      description: 'Session has been confirmed. The student has been notified.',
      variant: 'success',
      onClose: () => {},
    })
  }

  const handleDecline = async (_requestId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    toast({
      title: 'Request Declined',
      description: 'The student has been notified.',
      variant: 'warning',
      onClose: () => {},
    })
  }

  const handleMessage = (email: string) => {
    // Navigate to messages or open chat
    toast({
      title: 'Opening Chat',
      description: `Starting conversation with ${email}`,
      variant: 'default',
      onClose: () => {},
    })
  }

  return (
    <div className="space-y-6 animate-in slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-sl-text-primary">Tutor Requests</h1>
          <p className="text-sl-text-secondary mt-1">Manage incoming session requests from students</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="p-2">
          <div className="flex gap-1" role="tablist">
            {[
              { id: 'all', label: 'All', count: mockRequests.length },
              { id: 'pending', label: 'Pending', count: mockRequests.filter((r) => r.status === 'PENDING').length },
              { id: 'accepted', label: 'Accepted', count: mockRequests.filter((r) => r.status === 'ACCEPTED').length },
              { id: 'declined', label: 'Declined', count: mockRequests.filter((r) => r.status === 'DECLINED').length },
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeFilter === tab.id}
                onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  activeFilter === tab.id
                    ? 'bg-sl-accent-primary text-white shadow-glow-primary'
                    : 'text-sl-text-secondary hover:text-sl-text-primary hover:bg-sl-bg-secondary'
                )}
              >
                {tab.label}
                <span className={cn(
                  'px-2 py-0.5 text-xs rounded-full font-medium',
                  activeFilter === tab.id
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

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="w-12 h-12 text-sl-border mx-auto mb-4" />
            <h3 className="text-lg font-medium text-sl-text-primary mb-2">No requests found</h3>
            <p className="text-sl-text-secondary">
              {activeFilter === 'pending' ? 'No pending requests at the moment' : `No ${activeFilter} requests`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const statusConfig = getStatusConfig(request.status)
            const isExpanded = expandedId === request.id

            return (
              <Card key={request.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Main Request Card */}
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      {/* Student Info */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-sl-accent-primary/20 flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-sl-accent-primary" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-sl-text-primary truncate">{request.studentName}</h3>
                            <Badge variant={statusConfig.variant}>
                              {statusConfig.icon}
                              {statusConfig.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-sl-text-muted mt-1 truncate">{request.studentEmail}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-sl-text-secondary">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {request.subject}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(request.scheduledAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTime(request.scheduledAt)} • {request.duration}min
                            </span>
                            <span className="flex items-center gap-1">
                              {request.meetingType === 'online' ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              )}
                              {request.meetingType === 'online' ? 'Online' : 'In-Person'}
                            </span>
                            {request.location && (
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {request.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 sm:ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMessage(request.studentEmail)}
                          className="hidden sm:flex"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedId(isExpanded ? null : request.id)}
                          className="flex items-center gap-1"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-sl-border animate-in slide-down">
                        {request.topic && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-sl-text-secondary mb-1">Topic</p>
                            <p className="text-sl-text-primary">{request.topic}</p>
                          </div>
                        )}
                        {request.message && (
                          <div className="mb-4 p-3 bg-sl-bg-input/50 rounded-xl">
                            <p className="text-sm font-medium text-sl-text-secondary mb-1">Student Message</p>
                            <p className="text-sl-text-primary">{request.message}</p>
                          </div>
                        )}

                        {/* Action Buttons for Pending */}
                        {request.status === 'PENDING' && (
                          <div className="flex gap-3">
                            <Button
                              variant="primary"
                              onClick={() => handleAccept(request.id)}
                              className="flex-1"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Accept
                            </Button>
                            <Button
                              variant="secondary"
                              className="flex-1 bg-sl-error/10 text-sl-error hover:bg-sl-error/20 border-sl-error/30"
                              onClick={() => handleDecline(request.id)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Decline
                            </Button>
                          </div>
                        )}

                        {request.status === 'ACCEPTED' && (
                          <Button variant="primary" className="w-full">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Join Session
                          </Button>
                        )}

                        {request.status === 'DECLINED' && (
                          <p className="text-sm text-sl-text-muted text-center">
                            This request was declined.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}