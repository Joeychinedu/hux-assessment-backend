const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  // 1) Retrieve the user ID from the route parameter
  const userId = req.params.id;

  // 2) Find the user in the database by ID
  const user = await User.findById(userId);

  // 3) If no user found, return an error
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  // 4) Send the response with the user data
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
