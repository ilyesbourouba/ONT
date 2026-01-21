const express = require('express');
const router = express.Router();
const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour
} = require('../controller/virtualTourController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { idValidation, validate } = require('../utils/validators');

// Public routes
router.get('/', getAllTours);
router.get('/:id', idValidation, validate, getTourById);

// Protected routes
router.post('/', authMiddleware, createTour);
router.put('/:id', authMiddleware, idValidation, validate, updateTour);
router.delete('/:id', authMiddleware, idValidation, validate, deleteTour);

module.exports = router;
