const express = require('express');
const contactController = require('../controllers/contactController');
const router = express.Router();

const {
  checkID,
  checkBody,
  getAllContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = contactController;

router.param('id', checkID);

router.route('/').get(getAllContacts).post(checkBody, createContact);
router.route('/:id').get(getContact).patch(updateContact).delete(deleteContact);

module.exports = router;
