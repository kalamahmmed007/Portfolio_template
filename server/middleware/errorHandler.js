// Custom Error Response Class
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Main Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error to console for development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key error (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please login again.';
    error = new ErrorResponse(message, 401);
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired. Please login again.';
    error = new ErrorResponse(message, 401);
  }

  // Multer file upload errors
  if (err.name === 'MulterError') {
    let message = 'File upload error';
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large. Maximum size is 5MB';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files uploaded';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected file field';
    }
    
    error = new ErrorResponse(message, 400);
  }

  // MongoDB connection error
  if (err.name === 'MongoNetworkError' || err.name === 'MongoServerError') {
    const message = 'Database connection error';
    error = new ErrorResponse(message, 503);
  }

  // Syntax errors in JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    const message = 'Invalid JSON format';
    error = new ErrorResponse(message, 400);
  }

  // File type validation error
  if (err.message && err.message.includes('Only images are allowed')) {
    error = new ErrorResponse(err.message, 400);
  }

  // Build response object
  const response = {
    success: false,
    error: error.message || err.message || 'Server Error',
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.errorDetails = {
      name: err.name,
      code: err.code,
      statusCode: error.statusCode || 500,
    };
  }

  // Add error code for client handling
  if (error.statusCode) {
    response.statusCode = error.statusCode;
  }

  // Send response
  res.status(error.statusCode || 500).json(response);
};

// 404 Not Found Handler
const notFound = (req, res, next) => {
  const error = new ErrorResponse(
    `Route ${req.originalUrl} not found`,
    404
  );
  next(error);
};

// Async handler wrapper to catch errors in async functions
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation error formatter
const validationErrorFormatter = (errors) => {
  return errors.map(error => ({
    field: error.param,
    message: error.msg,
    value: error.value,
  }));
};

// Custom error classes for specific scenarios
class BadRequestError extends ErrorResponse {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

class ConflictError extends ErrorResponse {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

class ValidationError extends ErrorResponse {
  constructor(message = 'Validation Error', errors = []) {
    super(message, 422);
    this.errors = errors;
  }
}

class InternalServerError extends ErrorResponse {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}

// Export all error handlers and classes
module.exports = errorHandler;

module.exports.ErrorResponse = ErrorResponse;
module.exports.notFound = notFound;
module.exports.asyncHandler = asyncHandler;
module.exports.validationErrorFormatter = validationErrorFormatter;

// Export custom error classes
module.exports.BadRequestError = BadRequestError;
module.exports.UnauthorizedError = UnauthorizedError;
module.exports.ForbiddenError = ForbiddenError;
module.exports.NotFoundError = NotFoundError;
module.exports.ConflictError = ConflictError;
module.exports.ValidationError = ValidationError;
module.exports.InternalServerError = InternalServerError;