const express = require('express');
const router = express.Router();
const {
  getAboutData,
  getContent, updateContent,
  getMissions, createMission, updateMission, deleteMission,
  getStats, createStat, updateStat, deleteStat,
  getPillars, createPillar, updatePillar, deletePillar,
  getFaqs, createFaq, updateFaq, deleteFaq
} = require('../controller/aboutController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { idValidation, validate } = require('../utils/validators');

// ==============================
// PUBLIC ROUTES
// ==============================
router.get('/', getAboutData);

// ==============================
// CONTENT (Protected)
// ==============================
router.get('/content', getContent);
router.put('/content', authMiddleware, updateContent);

// ==============================
// MISSIONS (Protected CRUD)
// ==============================
router.get('/missions', getMissions);
router.post('/missions', authMiddleware, createMission);
router.put('/missions/:id', authMiddleware, idValidation, validate, updateMission);
router.delete('/missions/:id', authMiddleware, idValidation, validate, deleteMission);

// ==============================
// STATS (Protected CRUD)
// ==============================
router.get('/stats', getStats);
router.post('/stats', authMiddleware, createStat);
router.put('/stats/:id', authMiddleware, idValidation, validate, updateStat);
router.delete('/stats/:id', authMiddleware, idValidation, validate, deleteStat);

// ==============================
// PILLARS (Protected CRUD)
// ==============================
router.get('/pillars', getPillars);
router.post('/pillars', authMiddleware, createPillar);
router.put('/pillars/:id', authMiddleware, idValidation, validate, updatePillar);
router.delete('/pillars/:id', authMiddleware, idValidation, validate, deletePillar);

// ==============================
// FAQS (Protected CRUD)
// ==============================
router.get('/faqs', getFaqs);
router.post('/faqs', authMiddleware, createFaq);
router.put('/faqs/:id', authMiddleware, idValidation, validate, updateFaq);
router.delete('/faqs/:id', authMiddleware, idValidation, validate, deleteFaq);

module.exports = router;
