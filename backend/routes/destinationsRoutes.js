const express = require('express');
const router = express.Router();
const {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
} = require('../controller/destinationsController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { idValidation, validate } = require('../utils/validators');

// Public routes
router.get('/', getAllDestinations);
router.get('/:id', idValidation, validate, getDestinationById);

// Protected routes
router.post('/', authMiddleware, createDestination);
router.put('/:id', authMiddleware, idValidation, validate, updateDestination);
router.delete('/:id', authMiddleware, idValidation, validate, deleteDestination);

module.exports = router;
