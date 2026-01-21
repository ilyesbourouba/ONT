const express = require('express');
const router = express.Router();
const {
  getTranslations,
  getAvailableLanguages
} = require('../controller/translationsController');

// Public routes
router.get('/', getAvailableLanguages);
router.get('/:lang', getTranslations);

module.exports = router;
