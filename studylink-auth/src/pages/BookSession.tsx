/**
 * Book Session Page
 * Form to book a tutoring session with selected tutor
 */

import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  BookOpen,
  User,
  ArrowLeft,
  ChevronDown,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn, formatDate, formatTime } from '@/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '@/components/ui/toaster'

const bookingSchema = z.object({
  tutorId: z.string().min(1, 'Please select a tutor'),
  subject: z.string().min(1, 'Subject is required'),
  topic: z.string().min(1, 'Topic is required'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  duration: z.union([
    z.literal('60'),
    z.literal('90'),
    z.literal('120'),
  ]).refine((val) => val !== undefined, { message: 'Duration is required' }),
  notes: z.string().optional(),
  meetingType: z.union([
    z.literal('online'),
    z.literal('in-person'),
  ]).refine((val) => val !== undefined, { message: 'Meeting type is required' }),
})

type BookingFormData = z.infer<typeof bookingSchema>

const mockTutors = [
  { id: '1', name: 'Dr. Sarah Martinez', subjects: ['Calculus I', 'Calculus II', 'Linear Algebra'], rate: 350 },
  { id: '2', name: 'Prof. James Chen', subjects: ['Physics', 'Thermodynamics', 'Mechanics'], rate: 400 },
  { id: '3', name: 'Maria Santos', subjects: ['Chemistry', 'Organic Chemistry', 'Biochemistry'], rate: 300 },
  { id: '4', name: 'Dr. Robert Kim', subjects: ['Biology', 'Genetics', 'Cell Biology'], rate: 380 },
  { id: '5', name: 'Lisa Thompson', subjects: ['Statistics', 'Probability', 'Data Analysis'], rate: 280 },
  { id: '6', name: 'Alex Rivera', subjects: ['Programming', 'Python', 'JavaScript', 'Data Structures'], rate: 320 },
]

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00',
]

export function BookSession() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [selectedTutor, setSelectedTutor] = useState<typeof mockTutors[0] | null>(null)
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      tutorId: '',
      subject: '',
      topic: '',
      date: '',
      startTime: '',
      duration: '60',
      notes: '',
      meetingType: 'online',
    },
  })

  const watchedTutorId = watch('tutorId')
  const watchedDate = watch('date')

  // Pre-select tutor from URL param
  useEffect(() => {
    const tutorId = searchParams.get('tutor')
    if (tutorId) {
      const tutor = mockTutors.find((t) => t.id === tutorId)
      if (tutor) {
        setSelectedTutor(tutor)
        setValue('tutorId', tutor.id)
        setValue('subject', tutor.subjects[0])
      }
    }
  }, [searchParams, setValue])

  // Generate available dates (next 30 days, excluding weekends for demo)
  useEffect(() => {
    const dates: string[] = []
    const today = new Date()
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      // Skip weekends for demo
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0])
      }
    }
    setAvailableDates(dates)
  }, [])

  // Update subject options when tutor changes
  useEffect(() => {
    if (watchedTutorId) {
      const tutor = mockTutors.find((t) => t.id === watchedTutorId)
      if (tutor) {
        setSelectedTutor(tutor)
        setValue('subject', tutor.subjects[0])
      }
    } else {
      setSelectedTutor(null)
      setValue('subject', '')
    }
  }, [watchedTutorId, setValue])

  const onSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: 'Session Requested!',
        description: `Your session request has been sent to ${selectedTutor?.name}. You'll be notified when they respond.`,
        variant: 'success',
        onClose: () => {},
      })

      navigate('/my-sessions')
    } catch (error) {
      toast({
        title: 'Booking Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'error',
        onClose: () => {},
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalPrice = selectedTutor ? (selectedTutor.rate * parseInt(watch('duration') || '60') / 60) : 0

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in slide-up">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/find-tutor" className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-sl-text-secondary hover:text-sl-accent-primary hover:bg-sl-bg-secondary rounded-lg transition-all duration-200">
            <ArrowLeft className="w-4 h-4" />
            Back to Tutors
          </Link>
        <div>
          <h1 className="text-2xl font-bold text-sl-text-primary">Book a Session</h1>
          <p className="text-sl-text-secondary">Schedule your tutoring session</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Tutor Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Select Tutor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {mockTutors.map((tutor) => (
                <button
                  key={tutor.id}
                  type="button"
                  onClick={() => {
                    setValue('tutorId', tutor.id)
                    setValue('subject', tutor.subjects[0])
                  }}
                  className={cn(
                    'p-4 text-left rounded-xl border-2 transition-all duration-200',
                    'hover:border-sl-accent-primary/50 hover:bg-sl-bg-secondary',
                    watchedTutorId === tutor.id
                      ? 'border-sl-accent-primary bg-sl-accent-primary/10 shadow-glow-primary'
                      : 'border-sl-border'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sl-accent-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-sl-accent-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sl-text-primary">{tutor.name}</p>
                      <p className="text-sm text-sl-text-secondary">₱{tutor.rate}/hr</p>
                    </div>
                  </div>
                  {watchedTutorId === tutor.id && (
                    <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-sl-accent-primary" />
                  )}
                </button>
              ))}
            </div>
            {errors.tutorId && (
              <p className="mt-2 text-sm text-sl-error flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.tutorId.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Session Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Session Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <select
                  id="subject"
                  {...register('subject')}
                  className="input-field"
                  disabled={!watchedTutorId}
                >
                  <option value="">Select subject</option>
                  {selectedTutor?.subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.subject && <p className="mt-1 text-sm text-sl-error">{errors.subject.message}</p>}
              </div>

              <div>
                <Label htmlFor="topic">Topic / Focus Area</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Derivatives, Limits, Chain Rule"
                  {...register('topic')}
                />
                {errors.topic && <p className="mt-1 text-sm text-sl-error">{errors.topic.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="What would you like to focus on? Any specific problems or materials to review?"
                {...register('notes')}
                rows={3}
              />
            </div>

            <div>
              <Label>Meeting Type</Label>
              <div className="flex gap-4 mt-2">
                <label className={cn(
                  'flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all',
                  watch('meetingType') === 'online'
                    ? 'border-sl-accent-primary bg-sl-accent-primary/10'
                    : 'border-sl-border hover:border-sl-accent-primary/50'
                )}>
                  <input
                    type="radio"
                    value="online"
                    {...register('meetingType')}
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">💻</span>
                    <span className="font-medium">Online</span>
                    <span className="text-xs text-sl-text-muted">Video call</span>
                  </div>
                </label>
                <label className={cn(
                  'flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all',
                  watch('meetingType') === 'in-person'
                    ? 'border-sl-accent-primary bg-sl-accent-primary/10'
                    : 'border-sl-border hover:border-sl-accent-primary/50'
                )}>
                  <input
                    type="radio"
                    value="in-person"
                    {...register('meetingType')}
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">📍</span>
                    <span className="font-medium">In-Person</span>
                    <span className="text-xs text-sl-text-muted">Campus meetup</span>
                  </div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Date & Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <select
                  id="date"
                  {...register('date')}
                  className="input-field"
                >
                  <option value="">Select date</option>
                  {availableDates.map((date) => (
                    <option key={date} value={date}>
                      {formatDate(date)}
                    </option>
                  ))}
                </select>
                {errors.date && <p className="mt-1 text-sm text-sl-error">{errors.date.message}</p>}
              </div>

              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <select
                  id="startTime"
                  {...register('startTime')}
                  className="input-field"
                >
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {formatTime(`2000-01-01T${time}:00`)}
                    </option>
                  ))}
                </select>
                {errors.startTime && <p className="mt-1 text-sm text-sl-error">{errors.startTime.message}</p>}
              </div>

              <div>
                <Label htmlFor="duration">Duration</Label>
                <select
                  id="duration"
                  {...register('duration')}
                  className="input-field"
                >
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                </select>
                {errors.duration && <p className="mt-1 text-sm text-sl-error">{errors.duration.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Summary */}
        {selectedTutor && watchedDate && watch('startTime') && (
          <Card className="bg-sl-accent-primary/5 border-sl-accent-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sl-accent-primary/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-sl-accent-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sl-text-primary">Session Summary</p>
                    <p className="text-sm text-sl-text-secondary">
                      {formatDate(watchedDate)} at {formatTime(`2000-01-01T${watch('startTime')}:00`)} • {watch('duration')} min
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-sl-text-primary">₱{totalPrice}</p>
                  <p className="text-xs text-sl-text-muted">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <Link
            to="/find-tutor"
            className="flex-1 inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold rounded-xl bg-sl-bg-secondary text-sl-text-primary border border-sl-border hover:bg-sl-bg-input hover:border-sl-accent-primary/50 hover:text-sl-accent-primary active:scale-[0.98] transition-all duration-200"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className="flex-1"
            disabled={!selectedTutor || !watchedDate || !watch('startTime')}
          >
            Request Session
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  )
}