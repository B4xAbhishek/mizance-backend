const { body, validationResult } = require('express-validator');

exports.validateForm = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),

  // Convert the date string to a Date object
  body('date').isISO8601().toDate().withMessage('Invalid date'),

  // Convert the budget string to a number
  body('budget').isNumeric().toFloat().withMessage('Budget must be a number'),

  // Optional validation for attachment (if provided)
  body('attachment').optional(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
