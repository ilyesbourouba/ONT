const express = require('express');
const router = express.Router();
const {
  submitContact,
  getAllContacts,
  getContactById,
  deleteContact
} = require('../controller/contactController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { contactValidation, idValidation, paginationValidation, validate } = require('../utils/validators');

// Public route - submit contact form
router.post('/', contactValidation, validate, submitContact);

// Protected routes - admin only
router.get('/', authMiddleware, paginationValidation, validate, getAllContacts);
router.get('/:id', authMiddleware, idValidation, validate, getContactById);
router.delete('/:id', authMiddleware, idValidation, validate, deleteContact);

module.exports = router;
