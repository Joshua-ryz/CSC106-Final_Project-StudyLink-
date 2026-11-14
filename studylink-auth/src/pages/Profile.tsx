/**
 * Profile Page
 * View and edit user profile information
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  GraduationCap,
  BookOpen,
  Edit,
  Save,
  Camera,
  X,
  Calendar,
  Link as LinkIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { cn, getInitials } from '@/utils'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '@/components/ui/toaster'

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  course: z.string().min(2, 'Course must be at least 2 characters').max(100),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  subjects: z.string().optional(),
  hourlyRate: z.string().optional(),
  expertise: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

const expertiseOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

export function Profile() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      course: user?.course || '',
      bio: '',
      subjects: '',
      hourlyRate: '',
      expertise: 'intermediate',
    },
  })

  const isTutor = user?.role === 'tutor' || user?.role === 'both'

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local auth state
      updateUser({
        fullName: data.fullName,
        course: data.course,
      })

      setIsEditing(false)
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been saved successfully.',
        variant: 'success',
        onClose: () => {},
      })
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'error',
        onClose: () => {},
      })
    }
  }

  const handleCancel = () => {
    reset({
      fullName: user?.fullName || '',
      course: user?.course || '',
      bio: '',
      subjects: '',
      hourlyRate: '',
      expertise: 'intermediate',
    })
    setIsEditing(false)
    setAvatarPreview(null)
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const initials = getInitials(user?.fullName || 'U')

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-sl-text-primary">My Profile</h1>
          <p className="text-sl-text-secondary mt-1">Manage your personal information and preferences</p>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className={cn(
                'w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold',
                avatarPreview
                  ? 'bg-cover bg-center'
                  : 'bg-sl-accent-primary/20 text-sl-accent-primary'
              )}>
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={user?.fullName || 'Avatar'}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-sl-accent-primary flex items-center justify-center cursor-pointer hover:bg-sl-accent-primary/90 transition-colors">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="sr-only"
                  />
                </label>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                <h2 className="text-2xl font-bold text-sl-text-primary">{user?.fullName}</h2>
                {isEditing && (
                  <Button variant="ghost" size="sm" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
              <p className="text-sl-text-secondary">{user?.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                <Badge variant="outline" className="gap-1.5">
                  <GraduationCap className="w-3 h-3" />
                  {user?.course}
                </Badge>
                <Badge
                  variant={
                    user?.role === 'tutor' ? 'success' :
                    user?.role === 'both' ? 'warning' : 'default'
                  }
                  className="gap-1.5"
                >
                  <BookOpen className="w-3 h-3" />
                  {user?.role === 'seeker' ? 'Seeker' : user?.role === 'tutor' ? 'Tutor' : 'Both'}
                </Badge>
                <Badge variant="secondary" className="gap-1.5">
                  <Calendar className="w-3 h-3" />
                  Member since {new Date().getFullYear()}
                </Badge>
              </div>
            </div>

            {isEditing && !avatarPreview && (
              <Button variant="secondary" onClick={() => document.getElementById('avatar-input')?.click()}>
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Editable Profile Form */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
          {isEditing ? (
            <Button type="submit" form="profile-form" loading={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-1" />
              Edit Profile
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Basic Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  {...register('fullName')}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-sl-bg-secondary' : ''}
                />
                {errors.fullName && <p className="mt-1 text-sm text-sl-error">{errors.fullName.message}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email}
                  disabled
                  className="bg-sl-bg-secondary cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-sl-text-muted">Email cannot be changed</p>
              </div>

              <div>
                <Label htmlFor="course">Course / Program</Label>
                <Input
                  id="course"
                  {...register('course')}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-sl-bg-secondary' : ''}
                />
                {errors.course && <p className="mt-1 text-sm text-sl-error">{errors.course.message}</p>}
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={
                    user?.role === 'seeker' ? 'I need tutoring' :
                    user?.role === 'tutor' ? 'I want to be a tutor' : 'Both'
                  }
                  disabled
                  className="bg-sl-bg-secondary cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-sl-text-muted">Change role in Settings</p>
              </div>
            </div>

            {/* Tutor-specific fields */}
            {isTutor && (
              <div className="border-t border-sl-border pt-6">
                <h3 className="text-lg font-semibold text-sl-text-primary mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Tutor Profile
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell students about yourself, your teaching style, and experience..."
                      {...register('bio')}
                      rows={4}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-sl-bg-secondary' : ''}
                    />
                    <p className="mt-1 text-xs text-sl-text-muted">Max 500 characters</p>
                    {errors.bio && <p className="mt-1 text-sm text-sl-error">{errors.bio.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="subjects">Subjects (comma-separated)</Label>
                    <Input
                      id="subjects"
                      placeholder="e.g., Calculus I, Physics, Chemistry"
                      {...register('subjects')}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-sl-bg-secondary' : ''}
                    />
                    <p className="mt-1 text-xs text-sl-text-muted">Separate subjects with commas</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expertise">Expertise Level</Label>
                      <select
                        id="expertise"
                        {...register('expertise')}
                        disabled={!isEditing}
                        className={cn('input-field', !isEditing && 'bg-sl-bg-secondary')}
                      >
                        {expertiseOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="hourlyRate">Hourly Rate (₱)</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        placeholder="350"
                        {...register('hourlyRate')}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-sl-bg-secondary' : ''}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Read-only view for tutor fields when not editing */}
            {isTutor && !isEditing && (
              <div className="border-t border-sl-border pt-6 space-y-4">
                <h3 className="text-lg font-semibold text-sl-text-primary mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Tutor Profile
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-sl-text-muted">Bio</p>
                    <p className="text-sl-text-primary">Experienced tutor with a passion for helping students succeed.</p>
                  </div>
                  <div>
                    <p className="text-sl-text-muted">Subjects</p>
                    <p className="text-sl-text-primary">Calculus I, Physics, Chemistry</p>
                  </div>
                  <div>
                    <p className="text-sl-text-muted">Expertise</p>
                    <p className="text-sl-text-primary">Advanced</p>
                  </div>
                  <div>
                    <p className="text-sl-text-muted">Hourly Rate</p>
                    <p className="text-sl-text-primary">₱350/hr</p>
                  </div>
                </div>
              </div>
            )}

            {isEditing && (
              <div className="flex gap-3 pt-4 border-t border-sl-border">
                <Button type="submit" loading={isSubmitting}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button type="button" variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Quick Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link to="/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-sl-text-secondary hover:text-sl-accent-primary hover:bg-sl-bg-secondary rounded-xl transition-all duration-200 w-full">
              <Edit className="w-4 h-4" />
              Account Settings
            </Link>
            <Link to="/my-sessions" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-sl-text-secondary hover:text-sl-accent-primary hover:bg-sl-bg-secondary rounded-xl transition-all duration-200 w-full">
              <Calendar className="w-4 h-4" />
              My Sessions
            </Link>
            {isTutor && (
              <>
                <Link to="/my-availability" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-sl-text-secondary hover:text-sl-accent-primary hover:bg-sl-bg-secondary rounded-xl transition-all duration-200 w-full">
                  <Calendar className="w-4 h-4" />
                  Manage Availability
                </Link>
                <Link to="/tutor-requests" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-sl-text-secondary hover:text-sl-accent-primary hover:bg-sl-bg-secondary rounded-xl transition-all duration-200 w-full">
                  <BookOpen className="w-4 h-4" />
                  Tutor Requests
                </Link>
              </>
            )}
        </CardContent>
      </Card>
    </div>
  )
}