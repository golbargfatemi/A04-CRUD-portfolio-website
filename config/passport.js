const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = (passport) => {
  // Configure local strategy
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        // Find the user by username
        const user = await User.findOne({ username });

        // If no user is found
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        // Check password
        const isMatch = await user.isValidPassword(password);

        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        // If credentials are correct, return the user object
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Serialize user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};