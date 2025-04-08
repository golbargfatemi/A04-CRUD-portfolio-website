const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const multer = require("multer");
const { isAuthenticated, isAdmin } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/image/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Public routes (accessible to all)
router.get("/", projectController.getAllProjects);
router.get("/search", projectController.searchProjects);

// Admin-only routes - These specific routes must come BEFORE the /:id pattern
router.get("/create", isAuthenticated, isAdmin, projectController.create);
router.post("/", isAuthenticated, isAdmin, upload.single('screenshot'), projectController.createProject);

// Project detail routes - These must come AFTER all static routes like /create
router.get("/:id", projectController.getProjectById);
router.get("/:id/edit", isAuthenticated, isAdmin, projectController.showEditForm);
router.post("/:id/update", isAuthenticated, isAdmin, upload.single("screenshot"), projectController.updateProject);
router.post("/:id/delete", isAuthenticated, isAdmin, projectController.deleteProject);

module.exports = router;