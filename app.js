"use strict";
require("dotenv").config();
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const fs = require("fs");
const multer = require("multer");

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

const homeRoutes = require("./routes/home");
const aboutRoutes = require("./routes/about");
const projectsRoutes = require("./routes/projects");
const contactRoutes = require("./routes/contact");

const PORT = process.env.PORT || 3000;
const app = express();

//EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");

// Middleware
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const session = require("express-session");
const flash = require("connect-flash");

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.flashes = req.flash();
  next();
});

// Routes
app.use("/", homeRoutes);
app.use("/about", aboutRoutes);
app.use("/projects", projectsRoutes);
app.use("/contact", contactRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render("404");
});

// 500 error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    title: "Server Error",
    message: "Something went wrong on the server.",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
