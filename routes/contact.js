const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { isAuthenticated } = require('../middleware/auth');

// Contact routes (authenticated users only)
router.get('/', isAuthenticated, contactController.getContactPage);
router.post('/', isAuthenticated, contactController.submitContactForm);
router.get('/thank-you', isAuthenticated, contactController.getThankYouPage); 

module.exports = router;