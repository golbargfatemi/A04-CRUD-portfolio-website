const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Display contact form
router.get('/', contactController.getContactPage);

// Process contact form submission
router.post('/', contactController.submitContactForm);

// Thank you page
router.get('/thank-you', contactController.getThankYouPage);

module.exports = router;