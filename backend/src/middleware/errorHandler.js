// Generic error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log the error
  console.error(err.stack);

  // Set the status code based on the error or default to 500
  const statusCode = err.statusCode || 500;
  
  // Set the error message based on the environment
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

// 404 handler for undefined routes
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };