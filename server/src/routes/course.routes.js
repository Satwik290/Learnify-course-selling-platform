const express = require("express");
const router = express.Router();

const { createCourse } = require("../controllers/course.controllers");
const { upload } = require("../middlewares/upload.middlewares");
const { verifyToken } = require("../middlewares/auth.middlewares");

// POST /api/courses - Create a new course
router.post(
  "/",
  verifyToken,              // 🛡️ Auth middleware
  upload.single("thumbnail"), // 📷 File field name = "thumbnail"
  createCourse               // 💡 Controller logic
);

module.exports = router;
