const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Error handler for uncaught exception (Synchronous bug)
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!!!! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<DB_PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});

// Error handler for Unhandled Rejection (Asynchronous bug)
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!!!! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1); // Slowing kill the server (gracefully)
  });
});
