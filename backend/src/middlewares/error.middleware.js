import { ZodError } from 'zod';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import env from '../config/env.js';

/**
 * Express error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Handle Zod Schema validation errors
  if (error instanceof ZodError) {
    const combinedMessage = error.errors
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');
    error = new ApiError(400, `Validation failed: ${combinedMessage}`, error.errors, err.stack);
  }
  // Handle PostgreSQL specific constraints (e.g., duplicate email)
  else if (error.code === '23505') {
    error = new ApiError(409, 'User with this email already exists', [], err.stack);
  }
  // Handle standard Javascript Errors or unhandled exceptions
  else if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, [], err.stack);
  }

  const response = {
    success: false,
    message: error.message
  };

  // Structured Logging based on severity
  if (error.statusCode >= 500) {
    logger.error(`${req.method} ${req.path} - 500 Internal Error:`, {
      message: error.message,
      stack: error.stack
    });
  } else {
    logger.warn(`${req.method} ${req.path} - Client Warning [${error.statusCode}]: ${error.message}`);
  }

  // Do not expose stack traces in production
  if (env.NODE_ENV !== 'production' && err.stack && error.statusCode >= 500) {
    response.stack = err.stack;
  }

  return res.status(error.statusCode).json(response);
};

export default errorHandler;
