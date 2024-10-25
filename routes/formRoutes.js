const express = require('express');
const router = express.Router();
const { validateForm } = require('../middleware/formValidation');
const { submitForm } = require('../controllers/formController');

router.post('/submit', validateForm, submitForm);

module.exports = router;