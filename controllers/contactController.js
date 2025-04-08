const Message = require('../models/Message');

// Display contact form
exports.getContactPage = (req, res) => {
  res.render('contact', { 
    title: 'Contact Me',
    message: null
  });
};

// Process contact form submission
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Create new message
    const newMessage = new Message({
      name,
      email,
      message
    });
    
    // Save to database
    await newMessage.save();
    
    // Redirect to thank you page
    res.redirect('/contact/thank-you');
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).render('contact', { 
      title: 'Contact Me',
      message: 'Failed to send your message. Please try again.'
    });
  }
};

// Thank you page
exports.getThankYouPage = (req, res) => {
  res.render('thank-you', { 
    title: 'Thank You' 
  });
};