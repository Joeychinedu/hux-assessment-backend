// catchAsync is a higher-order function that wraps an asynchronous function (fn)
// and returns a new function that handles any errors that might occur during its execution.
// This is particularly useful in Express.js route handlers to catch errors in async functions
// and pass them to the next middleware (error handler) without the need for explicit try-catch blocks.
module.exports = (fn) => (req, res, next) => {
  // Call the asynchronous function 'fn' with the request (req), response (res), and next middleware (next).
  // 'fn' is expected to return a promise because it's an async function.
  fn(req, res, next)
    // If the promise is rejected (an error occurs), catch the error.
    .catch((err) =>
      // Pass the error to the next middleware function in the Express.js stack.
      // In Express, calling 'next' with an argument assumes it's an error, and it will be handled by the global error-handling middleware.
      next(err),
    );
};
