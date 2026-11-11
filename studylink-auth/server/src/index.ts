/**
 * Server Entry Point
 * Starts the Express application
 */

import app from './app'
import { env } from './config/env'
import prisma from './config/database'

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')

    // Start HTTP server
    const server = app.listen(env.port, () => {
      console.log(`🚀 Server running on http://localhost:${env.port}`)
      console.log(`📝 Environment: ${env.nodeEnv}`)
      console.log(`🌐 Frontend URL: ${env.frontendUrl}`)
    })

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n📴 ${signal} received. Shutting down gracefully...`)
      server.close(async () => {
        await prisma.$disconnect()
        console.log('✅ Database disconnected')
        process.exit(0)
      })

      // Force close after 10 seconds
      setTimeout(() => {
        console.error('❌ Forced shutdown after timeout')
        process.exit(1)
      }, 10000)
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()