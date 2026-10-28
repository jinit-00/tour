const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Error:', err.message);
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;

  // Prevent database errors, stack traces, or system paths from leaking to client in production
  let userFacingMessage = err.message || 'Internal Server Error';
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    userFacingMessage = 'An internal server error occurred. Please try again later.';
  }

  res.status(statusCode).json({
    error: userFacingMessage,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
