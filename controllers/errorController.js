const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  // err.keyValue is an object that returns the duplicate key value pair, so we just take the first item in it.
  const key = Object.keys(err.keyValue)[0];
  const value = err.keyValue[key];

  const message = `Duplicate field value: (${value}). Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  // In the case of validation errors, Mongoose returns an object (err.errors) containing errors for each invalid field.
  // We extract each error's message using Object.values, map over the array, and retrieve the error messages.
  // The messages are then joined into a single string to form a comprehensive error message.
  const errors = Object.values(err.errors).map((error) => error.message);
  const message = `Inavlid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token, Please log in  again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired!Please log in again.', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational error (error that we can "predict"): send to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //
    // Programming or other unknown error: Don't want to leak the error to the client
  } else {
    // 1) Log Error (For developers to know)
    console.error('ERROR!!!', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, name: err.name, code: err.code };
    console.log(error);

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);

    sendErrorProd(error, res);
  }
};
