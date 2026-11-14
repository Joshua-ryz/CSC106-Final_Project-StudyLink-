/**
 * My Availability Page
 * Weekly schedule grid for tutors to manage availability
 */

import { useState } from 'react'
import {
  Calendar,
  Sun,
  Moon,
  Coffee,
  Save,
  CheckCircle,
  XCircle,
  RotateCcw,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/toaster'

type TimeSlot = 'morning' | 'afternoon' | 'evening'
type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

type DayAvailability = {
  morning: boolean
  afternoon: boolean
  evening: boolean
}

type Availability = Record<DayOfWeek, DayAvailability>

const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const dayFullLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const slots: { id: TimeSlot; label: string; icon: React.ReactNode; time: string }[] = [
  { id: 'morning', label: 'Morning', icon: <Sun className="w-4 h-4" />, time: '8AM - 12PM' },
  { id: 'afternoon', label: 'Afternoon', icon: <Coffee className="w-4 h-4" />, time: '12PM - 5PM' },
  { id: 'evening', label: 'Evening', icon: <Moon className="w-4 h-4" />, time: '5PM - 10PM' },
]

const initialAvailability: Availability = {
  monday: { morning: false, afternoon: true, evening: true },
  tuesday: { morning: true, afternoon: false, evening: true },
  wednesday: { morning: false, afternoon: true, evening: true },
  thursday: { morning: true, afternoon: false, evening: true },
  friday: { morning: false, afternoon: true, evening: false },
  saturday: { morning: true, afternoon: true, evening: false },
  sunday: { morning: false, afternoon: false, evening: false },
}

export function MyAvailability() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [availability, setAvailability] = useState<Availability>(initialAvailability)
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)

  // Check if user has tutor role
  if (user?.role !== 'tutor' && user?.role !== 'both') {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Calendar className="w-12 h-12 text-sl-border mx-auto mb-4" />
          <h3 className="text-lg font-medium text-sl-text-primary mb-2">Tutor Access Required</h3>
          <p className="text-sl-text-secondary mb-6">
            This page is only available for tutors. Switch your role to 'Tutor' or 'Both' in Settings to manage your availability.
          </p>
        </CardContent>
      </Card>
    )
  }

  const toggleSlot = (day: DayOfWeek, slot: TimeSlot) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: !prev[day][slot],
      },
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: 'Availability Saved',
        description: 'Your weekly schedule has been updated.',
        variant: 'success',
        onClose: () => {},
      })
      setHasChanges(false)
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'error',
        onClose: () => {},
      })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setAvailability(initialAvailability)
    setHasChanges(false)
    toast({
      title: 'Reset Complete',
      description: 'Availability reset to default schedule.',
      variant: 'default',
      onClose: () => {},
    })
  }

  const getActiveSlotsCount = () => {
    let count = 0
    Object.values(availability).forEach((day) => {
      Object.values(day).forEach((active) => {
        if (active) count++
      })
    })
    return count
  }

  const isToday = (day: DayOfWeek) => {
    const today = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.
    const dayIndex = days.indexOf(day)
    // Adjust for Sunday = 0
    return (dayIndex + 1) % 7 === today
  }

  return (
    <div className="space-y-6 animate-in slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-sl-text-primary">My Availability</h1>
          <p className="text-sl-text-secondary mt-1">Set your weekly availability for tutoring sessions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleReset} disabled={saving}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving || !hasChanges} loading={saving}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sl-accent-primary/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-sl-accent-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-sl-text-primary">{getActiveSlotsCount()}</p>
                <p className="text-sm text-sl-text-secondary">Available Slots</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sl-success/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-sl-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-sl-text-primary">
                  {days.filter((d) => availability[d].morning || availability[d].afternoon || availability[d].evening).length}
                </p>
                <p className="text-sm text-sl-text-secondary">Active Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sl-warning/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-sl-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-sl-text-primary">
                  {hasChanges ? 'Unsaved' : 'Saved'}
                </p>
                <p className="text-sm text-sl-text-secondary">Status</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="font-medium text-sl-text-secondary">Legend:</span>
            <Badge variant="success" className="gap-1.5">
              <div className="w-3 h-3 rounded bg-sl-success" />
              Available
            </Badge>
            <Badge variant="secondary" className="gap-1.5">
              <div className="w-3 h-3 rounded bg-sl-bg-input border border-sl-border" />
              Unavailable
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <div className="w-3 h-3 rounded bg-sl-accent-primary/20 border border-sl-accent-primary" />
              Today
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full" role="grid">
              <thead>
                <tr className="border-b border-sl-border">
                  <th className="w-32 p-3 text-left font-medium text-sl-text-secondary">Time Slot</th>
                  {days.map((day, dayIndex) => (
                    <th
                      key={day}
                      className={cn(
                        'p-3 text-center font-medium text-sl-text-primary',
                        isToday(day) && 'bg-sl-accent-primary/5'
                      )}
                      scope="col"
                    >
                      <div className={cn('flex flex-col items-center gap-1', isToday(day) && 'text-sl-accent-primary')}>
                        <span className="font-semibold">{dayLabels[dayIndex]}</span>
                        <span className="text-xs text-sl-text-muted">{dayFullLabels[dayIndex]}</span>
                        {isToday(day) && (
                          <Badge variant="outline" className="mt-1 px-2 py-0.5 text-[10px]">
                            Today
                          </Badge>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot.id} className="border-b border-sl-border/50 last:border-0">
                    <th className="w-32 p-3 text-left font-medium text-sl-text-secondary" scope="row">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sl-bg-input flex items-center justify-center text-sl-text-muted">
                          {slot.icon}
                        </div>
                        <div>
                          <div className="font-medium text-sl-text-primary">{slot.label}</div>
                          <div className="text-xs text-sl-text-muted">{slot.time}</div>
                        </div>
                      </div>
                    </th>
                    {days.map((day) => (
                      <td key={`${day}-${slot.id}`} className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSlot(day, slot.id)}
                          className={cn(
                            'w-full h-10 rounded-xl transition-all duration-200',
                            'focus:outline-none focus:ring-2 focus:ring-sl-accent-primary focus:ring-offset-2 focus:ring-offset-sl-bg-main',
                            availability[day][slot.id]
                              ? 'bg-sl-success/20 hover:bg-sl-success/30 border border-sl-success/30'
                              : 'bg-sl-bg-input hover:bg-sl-bg-secondary border border-sl-border',
                            isToday(day) && 'ring-1 ring-sl-accent-primary/30'
                          )}
                          aria-label={`${dayFullLabels[days.indexOf(day)]} ${slot.label}: ${availability[day][slot.id] ? 'Available' : 'Unavailable'}`}
                          aria-pressed={availability[day][slot.id]}
                        >
                          {availability[day][slot.id] ? (
                            <CheckCircle className="w-5 h-5 text-sl-success mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-sl-border mx-auto" />
                          )}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => {
              const newAvail = Object.fromEntries(
                days.map((day) => [day, { morning: true, afternoon: true, evening: true }])
              ) as Availability
              setAvailability(newAvail)
              setHasChanges(true)
            }}>
              Set All Available
            </Button>
            <Button variant="secondary" onClick={() => {
              const newAvail = Object.fromEntries(
                days.map((day) => [day, { morning: false, afternoon: false, evening: false }])
              ) as Availability
              setAvailability(newAvail)
              setHasChanges(true)
            }}>
              Clear All
            </Button>
            <Button variant="secondary" onClick={() => {
              const newAvail = Object.fromEntries(
                days.map((day) => {
                  if (['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day)) {
                    return [day, { morning: false, afternoon: true, evening: true }]
                  }
                  if (day === 'saturday') {
                    return [day, { morning: true, afternoon: true, evening: false }]
                  }
                  return [day, { morning: false, afternoon: false, evening: false }]
                })
              ) as Availability
              setAvailability(newAvail)
              setHasChanges(true)
            }}>
              Weekdays Only
            </Button>
            <Button variant="secondary" onClick={() => {
              const newAvail = Object.fromEntries(
                days.map((day) => {
                  if (['saturday', 'sunday'].includes(day)) {
                    return [day, { morning: true, afternoon: true, evening: false }]
                  }
                  return [day, availability[day]]
                })
              ) as Availability
              setAvailability(newAvail)
              setHasChanges(true)
            }}>
              Weekends Only
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}