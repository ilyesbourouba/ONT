const express = require('express');
const router = express.Router();
const {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  likeNews
} = require('../controller/newsController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { newsValidation, idValidation, paginationValidation, validate } = require('../utils/validators');

// Public routes
router.get('/', paginationValidation, validate, getAllNews);
router.get('/:id', idValidation, validate, getNewsById);
router.post('/:id/like', idValidation, validate, likeNews);

// Protected routes
router.post('/', authMiddleware, newsValidation, validate, createNews);
router.put('/:id', authMiddleware, idValidation, validate, updateNews);
router.delete('/:id', authMiddleware, idValidation, validate, deleteNews);

module.exports = router;
