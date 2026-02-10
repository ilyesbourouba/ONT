const express = require('express');
const router = express.Router();
const { getContent, updateContent } = require('../controller/visitAlgeriaController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getContent);

// Protected routes
router.put('/', authMiddleware, updateContent);

module.exports = router;
