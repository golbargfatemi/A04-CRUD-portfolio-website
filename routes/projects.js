const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/image/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", projectController.getAllProjects);
router.get("/create", projectController.create);
router.post('/create', upload.single('screenshot'), projectController.createProject);router.get("/search", projectController.searchProjects);
router.get("/:id", projectController.getProjectById);
router.get("/:id/edit", projectController.showEditForm);
router.post("/:id/update", upload.single("screenshot"), projectController.updateProject);

router.post("/:id/delete", projectController.deleteProject);

module.exports = router;
