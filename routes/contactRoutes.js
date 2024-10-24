const express = require('express');
const contactController = require('../controllers/contactController');
const authController = require('../controllers/authController');

const router = express.Router();

const {
  getAllContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = contactController;

const { protect } = authController;

router.route('/').get(protect, getAllContacts).post(protect, createContact);
router
  .route('/:id')
  .get(protect, getContact)
  .patch(protect, updateContact)
  .delete(protect, deleteContact);

module.exports = router;
