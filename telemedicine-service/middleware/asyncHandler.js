/**
 * Async Error Handler Wrapper
 * Wraps async route handlers to pass errors to Express error middleware.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
