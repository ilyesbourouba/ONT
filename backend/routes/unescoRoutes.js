const express = require('express');
const router = express.Router();
const {
  getAllSites,
  getSiteById,
  createSite,
  updateSite,
  deleteSite
} = require('../controller/unescoController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { idValidation, validate } = require('../utils/validators');

// Public routes
router.get('/', getAllSites);
router.get('/:id', idValidation, validate, getSiteById);

// Protected routes
router.post('/', authMiddleware, createSite);
router.put('/:id', authMiddleware, idValidation, validate, updateSite);
router.delete('/:id', authMiddleware, idValidation, validate, deleteSite);

module.exports = router;
