/**
 * Find Tutor Page
 * Search and filter tutors by subject, availability, rating
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Star,
  BookOpen,
  UserCheck,
  ChevronDown,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Tutor {
  id: string
  name: string
  avatar?: string
  subjects: string[]
  expertise: 'beginner' | 'intermediate' | 'advanced'
  rating: number
  reviewCount: number
  hourlyRate: number
  availability: string[]
  bio: string
}

const mockTutors: Tutor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Martinez',
    subjects: ['Calculus I', 'Calculus II', 'Linear Algebra'],
    expertise: 'advanced',
    rating: 4.9,
    reviewCount: 47,
    hourlyRate: 350,
    availability: ['Mon 6-9PM', 'Wed 6-9PM', 'Sat 10AM-1PM'],
    bio: 'PhD in Mathematics with 10+ years teaching experience. Specializes in calculus and advanced mathematics.',
  },
  {
    id: '2',
    name: 'Prof. James Chen',
    subjects: ['Physics', 'Thermodynamics', 'Mechanics'],
    expertise: 'advanced',
    rating: 4.8,
    reviewCount: 32,
    hourlyRate: 400,
    availability: ['Tue 2-6PM', 'Thu 2-6PM', 'Fri 10AM-2PM'],
    bio: 'Physics professor at CSU. Published researcher in theoretical physics.',
  },
  {
    id: '3',
    name: 'Maria Santos',
    subjects: ['Chemistry', 'Organic Chemistry', 'Biochemistry'],
    expertise: 'intermediate',
    rating: 4.7,
    reviewCount: 28,
    hourlyRate: 300,
    availability: ['Mon 4-8PM', 'Wed 4-8PM', 'Sat 9AM-12PM'],
    bio: 'Chemistry graduate student. Passionate about making organic chemistry accessible.',
  },
  {
    id: '4',
    name: 'Dr. Robert Kim',
    subjects: ['Biology', 'Genetics', 'Cell Biology'],
    expertise: 'advanced',
    rating: 4.9,
    reviewCount: 41,
    hourlyRate: 380,
    availability: ['Tue 10AM-2PM', 'Thu 10AM-2PM', 'Sat 2-5PM'],
    bio: 'Molecular biology researcher. 8 years tutoring experience.',
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    subjects: ['Statistics', 'Probability', 'Data Analysis'],
    expertise: 'intermediate',
    rating: 4.6,
    reviewCount: 19,
    hourlyRate: 280,
    availability: ['Mon 7-10PM', 'Wed 7-10PM', 'Sun 1-4PM'],
    bio: 'Data scientist with industry experience. Makes statistics practical.',
  },
  {
    id: '6',
    name: 'Alex Rivera',
    subjects: ['Programming', 'Python', 'JavaScript', 'Data Structures'],
    expertise: 'intermediate',
    rating: 4.8,
    reviewCount: 35,
    hourlyRate: 320,
    availability: ['Daily 6-10PM', 'Weekends 10AM-4PM'],
    bio: 'Software engineer. Helps students build real projects while learning.',
  },
]

const subjects = [
  'Calculus I', 'Calculus II', 'Linear Algebra',
  'Physics', 'Thermodynamics', 'Mechanics',
  'Chemistry', 'Organic Chemistry', 'Biochemistry',
  'Biology', 'Genetics', 'Cell Biology',
  'Statistics', 'Probability', 'Data Analysis',
  'Programming', 'Python', 'JavaScript', 'Data Structures',
]

export function FindTutor() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('All Subjects')
  const [selectedExpertise, setSelectedExpertise] = useState('All Levels')
  const [sortBy, setSortBy] = useState<'rating' | 'rate' | 'reviews'>('rating')

  const filteredTutors = mockTutors
    .filter((tutor) => {
      const matchesSearch = tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.subjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesSubject = selectedSubject === 'All Subjects' || tutor.subjects.includes(selectedSubject)
      const matchesExpertise = selectedExpertise === 'All Levels' || tutor.expertise === selectedExpertise
      return matchesSearch && matchesSubject && matchesExpertise
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'rate':
          return a.hourlyRate - b.hourlyRate
        case 'reviews':
          return b.reviewCount - a.reviewCount
        default:
          return 0
      }
    })

  return (
    <div className="space-y-6 animate-in slide-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-sl-text-primary">Find a Tutor</h1>
          <p className="text-sl-text-secondary mt-1">Browse and connect with qualified CSU student tutors</p>
        </div>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sl-text-muted" />
              <Input
                type="text"
                placeholder="Search tutors, subjects, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="input-field pr-10 appearance-none cursor-pointer"
                  style={{ minWidth: '180px' }}
                >
                  <option value="All Subjects">All Subjects</option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sl-text-muted pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedExpertise}
                  onChange={(e) => setSelectedExpertise(e.target.value)}
                  className="input-field pr-10 appearance-none cursor-pointer"
                  style={{ minWidth: '150px' }}
                >
                  <option value="All Levels">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sl-text-muted pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'rating' | 'rate' | 'reviews')}
                  className="input-field pr-10 appearance-none cursor-pointer"
                  style={{ minWidth: '150px' }}
                >
                  <option value="rating">Highest Rated</option>
                  <option value="rate">Lowest Rate</option>
                  <option value="reviews">Most Reviews</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sl-text-muted pointer-events-none" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-sl-text-secondary">
        Showing {filteredTutors.length} tutor{filteredTutors.length !== 1 ? 's' : ''}
      </p>

      {/* Tutor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTutors.map((tutor) => (
          <Card key={tutor.id} className="hover:shadow-card-hover transition-shadow duration-300 h-full flex flex-col">
            <CardContent className="p-5 flex flex-col h-full">
              {/* Tutor Header */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-sl-accent-primary/20 flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-7 h-7 text-sl-accent-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sl-text-primary truncate">{tutor.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{tutor.rating}</span>
                      <span className="text-sl-text-muted text-sm">({tutor.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tutor.subjects.slice(0, 3).map((subject) => (
                      <span key={subject} className="px-2 py-0.5 text-xs bg-sl-bg-input border border-sl-border rounded-full text-sl-text-secondary">
                        {subject}
                      </span>
                    ))}
                    {tutor.subjects.length > 3 && (
                      <span className="px-2 py-0.5 text-xs bg-sl-bg-input border border-sl-border rounded-full text-sl-text-muted">
                        +{tutor.subjects.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Expertise & Rate */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-sl-border">
                <div className="flex items-center gap-2 text-sm text-sl-text-secondary">
                  <BookOpen className="w-4 h-4" />
                  <span className="capitalize">{tutor.expertise}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sl-text-primary">₱{tutor.hourlyRate}</p>
                  <p className="text-xs text-sl-text-muted">/hour</p>
                </div>
              </div>

              {/* Availability Preview */}
              <div className="mt-4">
                <p className="text-xs text-sl-text-muted mb-2">Available this week:</p>
                <div className="flex flex-wrap gap-1.5">
                  {tutor.availability.slice(0, 2).map((slot) => (
                    <span key={slot} className="px-2 py-1 text-xs bg-sl-bg-input border border-sl-border rounded-lg text-sl-text-secondary">
                      {slot}
                    </span>
                  ))}
                  {tutor.availability.length > 2 && (
                    <span className="px-2 py-1 text-xs bg-sl-bg-input border border-sl-border rounded-lg text-sl-text-muted">
                      +{tutor.availability.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bio */}
              <p className="mt-4 text-sm text-sl-text-secondary line-clamp-2 flex-1">{tutor.bio}</p>

              {/* Action Button */}
              <Button
                asChild
                className="mt-4 w-full"
                variant="primary"
              >
                <Link to={`/book-session?tutor=${tutor.id}`}>
                  Request Session
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTutors.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="w-12 h-12 text-sl-border mx-auto mb-4" />
            <h3 className="text-lg font-medium text-sl-text-primary mb-2">No tutors found</h3>
            <p className="text-sl-text-secondary">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}