/**
 * Authentication Middleware
 * JWT verification and role-based access control
 */

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/database'
import { env } from '../config/env'
import { ApiError } from './errorHandler'

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: string
      }
    }
  }
}

interface JwtPayload {
  userId: string
  email: string
  role: string
  type: 'access' | 'refresh'
}

/**
 * Verify access token from Authorization header or cookie
 */
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  // Try to get token from Authorization header first
  const authHeader = req.headers.authorization
  let token: string | undefined

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7)
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken
  }

  if (!token) {
    throw ApiError.unauthorized('Authentication required')
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload

    if (decoded.type !== 'access') {
      throw ApiError.unauthorized('Invalid token type')
    }

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    }

    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw ApiError.unauthorized('Token expired')
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw ApiError.unauthorized('Invalid token')
    }
    throw error
  }
}

/**
 * Optional authentication - doesn't throw if no token
 */
export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization
  let token: string | undefined

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7)
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload
      if (decoded.type === 'access') {
        req.user = {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        }
      }
    } catch {
      // Ignore invalid tokens for optional auth
    }
  }

  next()
}

/**
 * Role-based authorization middleware
 */
export function authorize(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required')
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw ApiError.forbidden('Insufficient permissions')
    }

    next()
  }
}

/**
 * Check if user is admin
 */
export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (!req.user) {
    throw ApiError.unauthorized('Authentication required')
  }

  if (req.user.role !== 'ADMIN') {
    throw ApiError.forbidden('Admin access required')
  }

  next()
}

/**
 * Generate access and refresh tokens
 */
export function generateTokens(user: { id: string; email: string; role: string }) {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role, type: 'access' },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] }
  )

  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role, type: 'refresh' },
    env.refreshTokenSecret,
    { expiresIn: env.refreshTokenExpiresIn as jwt.SignOptions['expiresIn'] }
  )

  return { accessToken, refreshToken }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, env.refreshTokenSecret) as JwtPayload
    if (decoded.type !== 'refresh') return null
    return decoded
  } catch {
    return null
  }
}