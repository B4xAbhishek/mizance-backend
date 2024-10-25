const { body, validationResult } = require('express-validator');

exports.validateForm = [
  // Basic Info
  // body('name').trim().notEmpty().withMessage('Name is required'),
  // body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  // body('phone').optional().matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/).withMessage('Invalid phone number format'),
  
  // // Communication Preferences
  // body('communicationMethod').isIn(['Email', 'Phone Call']).withMessage('Invalid communication method'),
  // body('contactTime').isIn(['Morning', 'Afternoon', 'Evening']).withMessage('Invalid contact time'),
  
  // // Project Details
  // body('projectType').isIn([
  //   'Websites/Web Apps',
  //   'Mobile Apps',
  //   'CRM/ERP Systems',
  //   'Data Analytics Dashboards',
  //   'E-commerce Solutions',
  //   'Other'
  // ]).withMessage('Invalid project type'),
  
  // body('projectDescription').trim().notEmpty().withMessage('Project description is required'),
  
  // // Features and Requirements
  // body('selectedFeatures').isArray().withMessage('Features must be an array'),
  // body('selectedFeatures.*').isString().withMessage('Each feature must be a string'),
  
  // body('budgetRange').isFloat({ min: 1000, max: 20000 }).withMessage('Budget must be between $1,000 and $20,000'),
  // body('timeframe').isInt({ min: 1, max: 12 }).withMessage('Timeframe must be between 1 and 12 months'),
  
  // // Target and Tech
  // body('targetAudience').isIn(['Consumers', 'Businesses', 'Educational Institutions', 'Other'])
  //   .withMessage('Invalid target audience'),
  
  // body('preferredTechStack').isArray().withMessage('Tech stack must be an array'),
  // body('preferredTechStack.*').isString().withMessage('Each tech stack item must be a string'),
  
  // // Schedule
  // body('scheduledMeeting').isISO8601().toDate().withMessage('Invalid meeting date'),

  // Validation Results Handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg
        }))
      });
  
  // Disable validation for now
  exports.validateForm = [];
    }
    next();
  }
];