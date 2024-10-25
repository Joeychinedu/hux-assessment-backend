const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const contactRouter = require('./routes/contactRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Logs basic information about the incoming http request
}
// Limit requests from same API
const limiter = rateLimit({
  max: 100000, // For testing purposes (This should be around 100)
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser (reading data from body into req.body)
app.use(
  express.json({
    limit: '10kb',
  }),
);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Enable CORS for requests coming from the frontend (localhost:5173)
app.use(
  cors({
    origin: 'http://localhost:5173', // Allow this origin to make requests
    credentials: true, // Allow cookies and credentials to be included in requests
  }),
);

// Test middlware
app.use((req, res, next) => {
  req.requesTime = new Date().toISOString();
  // console.log(req.requesTime)
  next();
});

// 2) ROUTES
app.use('/api/v1/contacts', contactRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
