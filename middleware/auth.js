// Middleware to check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error', 'Please log in to access this page');
    res.redirect('/login');
  };
  
  // Middleware to check if user is an admin
  exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.roles.includes('Admin')) {
      return next();
    }
    req.flash('error', 'You do not have permission to access this page');
    res.redirect('/');
  };
  
  // Middleware to add user info to locals for views
  exports.addUserToLocals = (req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.isAdmin = req.isAuthenticated() && req.user.roles.includes('Admin');
    next();
  };