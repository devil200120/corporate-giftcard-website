/**
 * Error Handler Utility
 * Provides standardized error creation and handling functions
 */

/**
 * Custom Error class for API errors
 */
class APIError extends Error {
  constructor(message, statusCode = 500, details = null, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Create a standardized error object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {any} details - Additional error details
 * @returns {APIError} - Standardized error object
 */
const createError = (message, statusCode = 500, details = null) => {
  return new APIError(message, statusCode, details);
};

/**
 * Async wrapper to catch errors in async functions
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Wrapped function with error catching
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Handle validation errors from express-validator
 * @param {Array} errors - Array of validation errors
 * @returns {APIError} - Formatted validation error
 */
const handleValidationErrors = (errors) => {
  const formattedErrors = errors.map(error => ({
    field: error.path || error.param,
    message: error.msg,
    value: error.value
  }));

  return createError(
    'Validation failed',
    400,
    {
      type: 'validation_error',
      errors: formattedErrors
    }
  );
};

/**
 * Handle MongoDB duplicate key errors
 * @param {Error} error - MongoDB error
 * @returns {APIError} - Formatted duplicate key error
 */
const handleDuplicateKeyError = (error) => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];
  
  return createError(
    `${field} '${value}' already exists`,
    409,
    {
      type: 'duplicate_key_error',
      field,
      value
    }
  );
};

/**
 * Handle MongoDB cast errors (invalid ObjectId)
 * @param {Error} error - MongoDB cast error
 * @returns {APIError} - Formatted cast error
 */
const handleCastError = (error) => {
  return createError(
    `Invalid ${error.path}: ${error.value}`,
    400,
    {
      type: 'cast_error',
      path: error.path,
      value: error.value
    }
  );
};

/**
 * Handle JWT errors
 * @param {Error} error - JWT error
 * @returns {APIError} - Formatted JWT error
 */
const handleJWTError = (error) => {
  if (error.name === 'JsonWebTokenError') {
    return createError('Invalid token', 401, { type: 'jwt_error' });
  }
  
  if (error.name === 'TokenExpiredError') {
    return createError('Token expired', 401, { type: 'jwt_expired' });
  }
  
  return createError('Authentication failed', 401, { type: 'auth_error' });
};

/**
 * Format error response for API
 * @param {APIError} error - Error object
 * @param {boolean} isDevelopment - Whether in development mode
 * @returns {Object} - Formatted error response
 */
const formatErrorResponse = (error, isDevelopment = false) => {
  const response = {
    success: false,
    message: error.message,
    timestamp: error.timestamp || new Date().toISOString(),
    statusCode: error.statusCode || 500
  };

  // Add details if available
  if (error.details) {
    response.details = error.details;
  }

  // Add stack trace in development
  if (isDevelopment && error.stack) {
    response.stack = error.stack;
  }

  // Add error type if available
  if (error.details?.type) {
    response.type = error.details.type;
  }

  return response;
};

/**
 * Log error with appropriate level
 * @param {Error} error - Error to log
 * @param {Object} req - Request object (optional)
 */
const logError = (error, req = null) => {
  const errorInfo = {
    message: error.message,
    statusCode: error.statusCode || 500,
    timestamp: new Date().toISOString(),
    ...(error.details && { details: error.details }),
    ...(req && {
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    })
  };

  // Log based on severity
  if (error.statusCode >= 500) {
    console.error('Server Error:', errorInfo);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
  } else if (error.statusCode >= 400) {
    console.warn('Client Error:', errorInfo);
  } else {
    console.info('Info:', errorInfo);
  }
};

/**
 * Send error response
 * @param {Error} error - Error object
 * @param {Object} res - Response object
 * @param {boolean} isDevelopment - Whether in development mode
 */
const sendErrorResponse = (error, res, isDevelopment = false) => {
  // Log error
  logError(error);

  // Format response
  const response = formatErrorResponse(error, isDevelopment);

  // Send response
  res.status(error.statusCode || 500).json(response);
};

/**
 * Common HTTP status codes
 */
const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
};

/**
 * Common error messages
 */
const ERROR_MESSAGES = {
  VALIDATION_FAILED: 'Validation failed',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  ALREADY_EXISTS: 'Resource already exists',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_INPUT: 'Invalid input provided',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid token provided'
};

module.exports = {
  APIError,
  createError,
  asyncHandler,
  handleValidationErrors,
  handleDuplicateKeyError,
  handleCastError,
  handleJWTError,
  formatErrorResponse,
  logError,
  sendErrorResponse,
  STATUS_CODES,
  ERROR_MESSAGES
};