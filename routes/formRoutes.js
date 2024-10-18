const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const formValidation = require('../middleware/formValidation');
//const upload = require('../middleware/upload');  // Assuming you have middleware for file uploads

// Route to handle form submission with file upload and validation
router.post('/submit', formValidation.validateForm, formController.submitForm);

module.exports = router;
