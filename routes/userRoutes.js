const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

const { getAllUsers, createUser, getUser, updateUser, deleteUser } =
  userController;
const { signup, login } = authController;

const { protect } = authController;

router.post('/signup', signup);
router.post('/login', login);

router.route('/').get(getAllUsers).post(createUser);
router
  .route('/:id')
  .get(protect, getUser)
  .patch(protect, updateUser)
  .delete(protect, deleteUser);

module.exports = router;
