const { body, param, query, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
};

/**
 * News validation rules
 */
const newsValidation = [
  body('title_en').notEmpty().withMessage('English title is required'),
  body('category').optional().isIn(['Institutional', 'Tourism', 'Events', 'Cultural']),
  body('content_en').optional().isLength({ min: 10 }).withMessage('Content must be at least 10 characters')
];

/**
 * Activity validation rules
 */
const activityValidation = [
  body('name_en').notEmpty().withMessage('English name is required'),
  body('date').optional().isString()
];

/**
 * Contact form validation rules
 */
const contactValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Message is required')
];

/**
 * ID parameter validation
 */
const idValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid ID is required')
];

/**
 * Pagination query validation
 */
const paginationValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
];

/**
 * Hero slide validation rules
 */
const heroValidation = [
  body('headline_en').notEmpty().withMessage('English headline is required'),
  body('button_link').optional().isURL().withMessage('Button link must be a valid URL')
];

module.exports = {
  validate,
  newsValidation,
  activityValidation,
  contactValidation,
  heroValidation,
  idValidation,
  paginationValidation
};

