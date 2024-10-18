const { body, validationResult } = require('express-validator');

exports.validateForm = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('date').isISO8601().withMessage('Invalid date'),
  body('budget').isNumeric().withMessage('Budget must be a number'),

  // Optional validation for attachment (if provided)
  body('attachment').optional().custom((value, { req }) => {
    if (value && typeof value !== 'object') {
      throw new Error('Attachment must be an object');
    }
    return true;
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
