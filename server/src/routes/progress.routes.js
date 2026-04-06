const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middlewares");
const { toggleLessonProgress, getCourseProgress } = require("../controllers/progress.controllers");

// ✅ Toggle lesson completion (Student only)
router.patch("/:courseId/lesson/:lessonId", verifyToken, toggleLessonProgress);

// ✅ Get course progress percentage (Student only)
router.get("/:courseId", verifyToken, getCourseProgress);

module.exports = router;
