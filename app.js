const express = require('express');
const morgan = require('morgan');

const contactRouter = require('./routes/contactRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev')); // Logs basic information about the incoming http request

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  next();
});

app.use((req, res, next) => {
  req.requesTime = new Date().toISOString();
  next();
});

// 2) ROUTES
app.use('/api/v1/contacts', contactRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
