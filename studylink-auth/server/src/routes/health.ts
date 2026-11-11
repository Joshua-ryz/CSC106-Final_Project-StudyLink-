/**
 * Health Check Routes
 * Public endpoints for monitoring
 */

import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import prisma from '../config/database'

const router = Router()

router.get('/', asyncHandler(async (_req, res) => {
  // Check database connection
  await prisma.$queryRaw`SELECT 1`

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  })
}))

router.get('/ready', asyncHandler(async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ ready: true })
  } catch {
    res.status(503).json({ ready: false, reason: 'Database unavailable' })
  }
}))

export { router as healthRoutes }