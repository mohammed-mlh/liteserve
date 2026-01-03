import { Request, Response, NextFunction } from 'express';
import { DatabaseError, ValidationError, AuthenticationError } from './errors';

/**
 * Centralized error handler middleware
 */
export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  // Log error with context
  console.error(`[${new Date().toISOString()}] Error:`, {
    name: error.name,
    message: error.message,
    path: req.path,
    method: req.method,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });

  // Handle custom error types
  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: 'Validation Error',
      message: error.message
    });
  }

  if (error instanceof AuthenticationError) {
    return res.status(401).json({
      error: 'Authentication Error',
      message: error.message
    });
  }

  if (error instanceof DatabaseError) {
    return res.status(error.statusCode).json({
      error: 'Database Error',
      message: error.message
    });
  }

  // Handle unexpected errors
  return res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
  });
}

