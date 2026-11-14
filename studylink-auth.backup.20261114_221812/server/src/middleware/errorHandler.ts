/**
 * Global Error Handler Middleware
 * Centralized error handling for the API
 */

import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { env, isProduction } from '../config/env'

export interface AppError extends Error {
  statusCode?: number
  errors?: Record<string, string[]>
  isOperational?: boolean
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errors?: Record<string, string[]>,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = 'ApiError'
    Object.setPrototypeOf(this, ApiError.prototype)
  }

  static badRequest(message: string, errors?: Record<string, string[]>): ApiError {
    return new ApiError(message, 400, errors)
  }

  static unauthorized(message: string = 'Unauthorized'): ApiError {
    return new ApiError(message, 401)
  }

  static forbidden(message: string = 'Forbidden'): ApiError {
    return new ApiError(message, 403)
  }

  static notFound(message: string = 'Resource not found'): ApiError {
    return new ApiError(message, 404)
  }

  static conflict(message: string): ApiError {
    return new ApiError(message, 409)
  }

  static internal(message: string = 'Internal server error'): ApiError {
    return new ApiError(message, 500, undefined, false)
  }
}

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Log error in development
  if (!isProduction) {
    console.error('❌ Error:', err)
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {}
    err.errors.forEach((e) => {
      const path = e.path.join('.')
      if (!errors[path]) errors[path] = []
      errors[path].push(e.message)
    })
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid request data',
      errors,
    })
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.join(', ') || 'field'
      return res.status(409).json({
        error: 'Conflict',
        message: `A record with this ${target} already exists`,
        errors: { [target]: ['Already exists'] },
      })
    }

    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found',
      })
    }
  }

  // Custom API errors
  if (err instanceof ApiError || 'statusCode' in err) {
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({
      error: err.name || 'Error',
      message: err.message,
      errors: err.errors,
    })
  }

  // Unknown errors
  const message = isProduction
    ? 'An unexpected error occurred'
    : err.message || 'An unexpected error occurred'

  return res.status(500).json({
    error: 'Internal Server Error',
    message,
  })
}

// Async handler wrapper to catch errors in async route handlers
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}