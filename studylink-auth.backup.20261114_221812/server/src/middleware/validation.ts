/**
 * Validation Middleware
 * Zod schema validation for request bodies, queries, and params
 */

import { Request, Response, NextFunction } from 'express'
import { ZodTypeAny, ZodError } from 'zod'
import { ApiError } from './errorHandler'

/**
 * Validate request against Zod schema
 */
export function validate(schema: ZodTypeAny) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {}
        error.errors.forEach((e) => {
          const path = e.path.join('.')
          if (!errors[path]) errors[path] = []
          errors[path].push(e.message)
        })
        return next(ApiError.badRequest('Validation failed', errors))
      }
      return next(error)
    }
  }
}

/**
 * Validate request body only
 */
export function validateBody(schema: ZodTypeAny) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {}
        error.errors.forEach((e) => {
          const path = e.path.join('.')
          if (!errors[path]) errors[path] = []
          errors[path].push(e.message)
        })
        return next(ApiError.badRequest('Invalid request body', errors))
      }
      return next(error)
    }
  }
}

/**
 * Validate query parameters only
 */
export function validateQuery(schema: ZodTypeAny) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.query = await schema.parseAsync(req.query)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {}
        error.errors.forEach((e) => {
          const path = e.path.join('.')
          if (!errors[path]) errors[path] = []
          errors[path].push(e.message)
        })
        return next(ApiError.badRequest('Invalid query parameters', errors))
      }
      return next(error)
    }
  }
}

/**
 * Validate URL parameters only
 */
export function validateParams(schema: ZodTypeAny) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.params = await schema.parseAsync(req.params)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {}
        error.errors.forEach((e) => {
          const path = e.path.join('.')
          if (!errors[path]) errors[path] = []
          errors[path].push(e.message)
        })
        return next(ApiError.badRequest('Invalid URL parameters', errors))
      }
      return next(error)
    }
  }
}