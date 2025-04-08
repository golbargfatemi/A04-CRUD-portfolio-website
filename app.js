"use strict";
require("dotenv").config();
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const flash = require("connect-flash");
const projectController = require("./controllers/projectController");
const multer = require("multer");
const { isAuthenticated, isAdmin } = require('./middleware/auth');

// Connect to Database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

// Import Routes
const homeRoutes = require("./routes/home");
const aboutRoutes = require("./routes/about");
const projectsRoutes = require("./routes/projects");
const contactRoutes = require("./routes/contact");
const authRoutes = require("./routes/auth");

// Passport Configuration
const configurePassport = require("./config/passport");

const PORT = process.env.PORT || 3000;
const app = express();

// EJS Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");

// Middleware
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Configuration with MongoDB Store
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_very_long_and_secure_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      autoRemove: 'interval',
      autoRemoveInterval: 10 // Remove expired sessions every 10 minutes
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 // 1 hour
    }
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);

// Flash Messages
app.use(flash());

// Global Middleware for Flash Messages and User
app.use((req, res, next) => {
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.isAdmin = req.user && req.user.roles.includes('Admin');
  next();
});

// Routes
app.use("/", homeRoutes);
app.use("/", authRoutes); 
app.use("/about", aboutRoutes);
app.use("/projects", projectsRoutes);
app.use("/contact", contactRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found"
  });
});

// 500 error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong on the server.'
  });
});
// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;