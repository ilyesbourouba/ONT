const express = require('express');
const router = express.Router();
const {
  getAllSlides,
  getActiveSlides,
  getSlideById,
  createSlide,
  updateSlide,
  deleteSlide
} = require('../controller/heroController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { heroValidation, idValidation, validate } = require('../utils/validators');

// Public routes
router.get('/', getAllSlides);
router.get('/active', getActiveSlides);
router.get('/:id', idValidation, validate, getSlideById);

// Protected routes
router.post('/', authMiddleware, heroValidation, validate, createSlide);
router.put('/:id', authMiddleware, idValidation, validate, updateSlide);
router.delete('/:id', authMiddleware, idValidation, validate, deleteSlide);

module.exports = router;
