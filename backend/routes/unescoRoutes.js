const express = require('express');
const router = express.Router();
const {
  getAll,
  getAllSites,
  getSiteById,
  createSite,
  updateSite,
  deleteSite,
  getContent,
  updateContent
} = require('../controller/unescoController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { idValidation, validate } = require('../utils/validators');

// Public routes
router.get('/', getAll);  // Returns both content and sites
router.get('/sites', getAllSites);
router.get('/sites/:id', idValidation, validate, getSiteById);
router.get('/content', getContent);

// Protected routes
router.post('/sites', authMiddleware, createSite);
router.put('/sites/:id', authMiddleware, idValidation, validate, updateSite);
router.delete('/sites/:id', authMiddleware, idValidation, validate, deleteSite);
router.put('/content', authMiddleware, updateContent);

module.exports = router;

