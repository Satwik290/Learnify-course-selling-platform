const express = require("express");
const router = express.Router();

// 👇 Import controller & middlewares
const { createCourse } = require("../controllers/course.controllers");
const { upload } = require("../middlewares/upload.middlewares");
const { verifyToken } = require("../middlewares/auth.middlewares");

// 👇 Define route to create a course
router.post(
  "/",
  verifyToken,               // 🛡️ 1. Authentication middleware
  upload.single("thumbnail"), // 📷 2. Multer middleware to handle image
  createCourse                // 💡 3. Controller to handle logic
);

module.exports = router;
