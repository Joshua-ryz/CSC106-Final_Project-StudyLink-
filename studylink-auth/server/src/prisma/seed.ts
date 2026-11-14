/**
 * Prisma Seed Script
 * Creates initial development data
 */

import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data (in development only)
  if (process.env.NODE_ENV !== 'production') {
    await prisma.passwordResetToken.deleteMany()
    await prisma.refreshToken.deleteMany()
    await prisma.rating.deleteMany()
    await prisma.session.deleteMany()
    await prisma.tutorProfile.deleteMany()
    await prisma.user.deleteMany()
    console.log('🧹 Cleaned existing data')
  }

  // Hash password for all test users
  const passwordHash = await bcrypt.hash('password123', 12)
  const adminPasswordHash = await bcrypt.hash('admin123', 12)

  // Create test users
  const users = [
    {
      email: 'maria.santos@carsu.edu.ph',
      passwordHash,
      fullName: 'Maria Santos',
      course: 'BS Computer Science',
      role: UserRole.seeker,
      isVerified: true,
    },
    {
      email: 'juan.delacruz@carsu.edu.ph',
      passwordHash,
      fullName: 'Juan Dela Cruz',
      course: 'BS Information Technology',
      role: UserRole.both,
      isVerified: true,
    },
    {
      email: 'anna.rodriguez@carsu.edu.ph',
      passwordHash,
      fullName: 'Anna Rodriguez',
      course: 'BS Mathematics',
      role: UserRole.both,
      isVerified: true,
    },
    {
      email: 'pedro.garcia@carsu.edu.ph',
      passwordHash,
      fullName: 'Pedro Garcia',
      course: 'BS Physics',
      role: UserRole.seeker,
      isVerified: true,
    },
    {
      email: 'lisa.fernandez@carsu.edu.ph',
      passwordHash,
      fullName: 'Lisa Fernandez',
      course: 'BS Chemistry',
      role: UserRole.both,
      isVerified: true,
    },
    {
      email: 'admin@carsu.edu.ph',
      passwordHash: adminPasswordHash,
      fullName: 'System Administrator',
      course: 'Administration',
      role: UserRole.ADMIN,
      isVerified: true,
    },
  ]

  for (const userData of users) {
    const user = await prisma.user.create({
      data: userData,
    })
    console.log(`✅ Created user: ${user.email} (${user.role})`)
  }

  // Create tutor profiles for tutor users
  const tutorUsers = await prisma.user.findMany({
    where: {
      role: { in: [UserRole.tutor, UserRole.both] },
    },
  })

  const tutorProfiles = [
    {
      userId: tutorUsers.find(u => u.email === 'juan.delacruz@carsu.edu.ph')!.id,
      subjects: ['Programming', 'Data Structures', 'Algorithms', 'Web Development'],
      expertise: 'advanced',
      expertiseLevels: { beginner: true, intermediate: true, advanced: true },
      availability: { morning: true, afternoon: true, evening: false },
      bio: 'Experienced software developer with 3+ years of tutoring experience. Specializes in programming fundamentals and web technologies.',
      about: 'Experienced software developer with 3+ years of tutoring experience. Specializes in programming fundamentals and web technologies.',
      hourlyRate: 150.00,
      rating: 4.8,
      totalReviews: 24,
    },
    {
      userId: tutorUsers.find(u => u.email === 'anna.rodriguez@carsu.edu.ph')!.id,
      subjects: ['Calculus', 'Linear Algebra', 'Statistics', 'Discrete Mathematics'],
      expertise: 'advanced',
      expertiseLevels: { beginner: true, intermediate: true, advanced: true },
      availability: { morning: false, afternoon: true, evening: true },
      bio: 'Mathematics enthusiast and teaching assistant. Helps students build strong mathematical foundations.',
      about: 'Mathematics enthusiast and teaching assistant. Helps students build strong mathematical foundations.',
      hourlyRate: 180.00,
      rating: 4.9,
      totalReviews: 18,
    },
    {
      userId: tutorUsers.find(u => u.email === 'lisa.fernandez@carsu.edu.ph')!.id,
      subjects: ['General Chemistry', 'Organic Chemistry', 'Physical Chemistry'],
      expertise: 'intermediate',
      expertiseLevels: { beginner: true, intermediate: true, advanced: false },
      availability: { morning: true, afternoon: false, evening: true },
      bio: 'Chemistry major with research experience. Makes complex chemical concepts easy to understand.',
      about: 'Chemistry major with research experience. Makes complex chemical concepts easy to understand.',
      hourlyRate: 160.00,
      rating: 4.7,
      totalReviews: 12,
    },
  ]

  for (const profile of tutorProfiles) {
    await prisma.tutorProfile.create({ data: profile })
    console.log(`✅ Created tutor profile for user: ${profile.userId}`)
  }

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })