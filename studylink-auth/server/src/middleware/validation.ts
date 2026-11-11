/**
 * Validation Middleware
 * Zod schema validation for request bodies, queries, and params
 */

import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'
import { ApiError } from './errorHandler'

/**
 * Validate request against Zod schema
 */
export function validate(schema: AnyZodObject) {
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
        throw ApiError.badRequest('Validation failed', errors)
      }
      throw error
    }
  }
}

/**
 * Validate request body only
 */
export function validateBody(schema: AnyZodObject) {
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
        throw ApiError.badRequest('Invalid request body', errors)
      }
      throw error
    }
  }
}

/**
 * Validate query parameters only
 */
export function validateQuery(schema: AnyZodObject) {
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
        throw ApiError.badRequest('Invalid query parameters', errors)
      }
      throw error
    }
  }
}

/**
 * Validate URL parameters only
 */
export function validateParams(schema: AnyZodObject) {
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
        throw ApiError.badRequest('Invalid URL parameters', errors)
      }
      throw error
    }
  }
}