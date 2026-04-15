/**
 * Async Error Handler Wrapper
 *
 * Wraps async route handlers to catch errors and pass them to the error middleware.
 * Without this, unhandled promise rejections would not trigger the error handler.
 */

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
