const passport = require('passport');
const User = require('../models/User');

// Get Login Page
exports.getLoginPage = (req, res) => {
  res.render('login', {
    title: 'Login',
    errors: req.flash('error'),
    success: req.flash('success')
  });
};

// Login User
exports.loginUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      // If there's an error during authentication
      console.error('Authentication error:', err);
      return next(err);
    }
    
    if (!user) {
      // Authentication failed
      req.flash('error', info.message || 'Login failed');
      return res.redirect('/login');
    }
    
    // Login successful
    req.login(user, (loginErr) => {
      if (loginErr) {
        console.error('Login error:', loginErr);
        return next(loginErr);
      }
      
      req.flash('success', 'Login successful');
      return res.redirect('/');
    });
  })(req, res, next);
};

// Logout User
exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return next(err);
    }
    req.flash('success', 'You have been logged out');
    res.redirect('/');
  });
};

// Get Register Page
exports.getRegisterPage = (req, res) => {
  res.render('register', {
    title: 'Register',
    errors: req.flash('error'),
    success: req.flash('success')
  });
};

// Register User
exports.registerUser = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Basic validation
  if (password !== confirmPassword) {
    req.flash('error', 'Passwords do not match');
    return res.redirect('/register');
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingUser) {
      req.flash('error', 'Username or email already exists');
      return res.redirect('/register');
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      roles: ['User'] // Default role
    });

    await newUser.save();

    req.flash('success', 'Registration successful. Please log in.');
    res.redirect('/login');
  } catch (error) {
    console.error('Registration error:', error);
    req.flash('error', 'Registration failed. Please try again.');
    res.redirect('/register');
  }
};

exports.makeAdmin = async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be logged in');
    return res.redirect('/login');
  }
  
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.roles.includes('Admin')) {
      user.roles.push('Admin');
      await user.save();
      req.flash('success', 'You are now an Admin');
    } else {
      req.flash('info', 'You are already an Admin');
    }
    
    return res.redirect('/');
  } catch (error) {
    console.error('Error updating user role:', error);
    req.flash('error', 'Failed to update role');
    return res.redirect('/');
  }
};