const express = require('express');
const router = express.Router();
const {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity
} = require('../controller/activitiesController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { activityValidation, idValidation, paginationValidation, validate } = require('../utils/validators');

// Public routes
router.get('/', paginationValidation, validate, getAllActivities);
router.get('/:id', idValidation, validate, getActivityById);

// Protected routes
router.post('/', authMiddleware, activityValidation, validate, createActivity);
router.put('/:id', authMiddleware, idValidation, validate, updateActivity);
router.delete('/:id', authMiddleware, idValidation, validate, deleteActivity);

module.exports = router;
