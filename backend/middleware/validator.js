const { body, validationResult } = require('express-validator');

// Validation middleware
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Contact form validation rules
exports.contactValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
      .escape(),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('subject')
      .trim()
      .notEmpty().withMessage('Subject is required')
      .isLength({ min: 3, max: 200 }).withMessage('Subject must be between 3 and 200 characters')
      .escape(),
    body('message')
      .trim()
      .notEmpty().withMessage('Message is required')
      .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters')
      .escape()
  ];
};

// Project validation rules
exports.projectValidationRules = () => {
  return [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters')
      .escape(),
    body('description')
      .trim()
      .notEmpty().withMessage('Description is required')
      .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
      .escape(),
    body('fullDescription')
      .trim()
      .notEmpty().withMessage('Full description is required')
      .escape(),
    body('image')
      .trim()
      .notEmpty().withMessage('Image URL is required')
      .isURL().withMessage('Please provide a valid URL'),
    body('technologies')
      .isArray().withMessage('Technologies must be an array'),
    body('link')
      .optional()
      .trim()
      .isURL().withMessage('Please provide a valid URL')
  ];
};

// Skill validation rules
exports.skillValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters')
      .escape(),
    body('icon')
      .trim()
      .notEmpty().withMessage('Icon is required'),
    body('level')
      .trim()
      .notEmpty().withMessage('Level is required')
      .isIn(['Basic', 'Intermediate', 'Proficient', 'Expert']).withMessage('Invalid level'),
    body('proficiency')
      .notEmpty().withMessage('Proficiency is required')
      .isInt({ min: 0, max: 100 }).withMessage('Proficiency must be between 0 and 100')
  ];
};

