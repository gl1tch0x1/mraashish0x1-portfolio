const express = require('express');
const {
  submitContact,
  getContacts,
  getContact,
  updateContactStatus,
  deleteContact
} = require('../controllers/contactController');

const router = express.Router();

const { protect } = require('../middleware/auth');
const { contactValidationRules, validate } = require('../middleware/validator');

router
  .route('/')
  .get(protect, getContacts)
  .post(contactValidationRules(), validate, submitContact);

router
  .route('/:id')
  .get(protect, getContact)
  .put(protect, updateContactStatus)
  .delete(protect, deleteContact);

module.exports = router;

