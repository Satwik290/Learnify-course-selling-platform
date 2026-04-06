const express = require("express");
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getMyCourses,
  getInstructorStats,
  getCourseById,
  updateCourse,
  deleteCourse,
  getInstructorPublicCourses,
} = require("../controllers/course.controllers");

const { upload } = require("../middlewares/upload.middlewares");
const { verifyToken } = require("../middlewares/auth.middlewares");
const { restrictTo } = require("../middlewares/role.middleware");

// Frontend calls: POST /api/courses/create
router.post(
  "/create",
  verifyToken,
  restrictTo("instructor", "admin"),
  upload.single("thumbnail"),
  createCourse
);

// POST to root (backward compatible)
router.post(
  "/",
  verifyToken,
  restrictTo("instructor", "admin"),
  upload.single("thumbnail"),
  createCourse
);

// Frontend calls: GET /api/courses/view  → get all courses
router.get("/view", getAllCourses);

// Backward compatible root GET
router.get("/", getAllCourses);

// Frontend calls: GET /api/courses/view/:id → get single course
router.get("/view/:id", getCourseById);

// Backward compatible /:id GET
router.get("/:id", getCourseById);

// ✅ Instructor Only Routes
router.get(
  "/instructor/my-courses",
  verifyToken,
  restrictTo("instructor", "admin"),
  getMyCourses
);

router.get(
  "/instructor/stats",
  verifyToken,
  restrictTo("instructor", "admin"),
  getInstructorStats
);

// ✅ Public Instructor Courses
router.get("/instructor/:instructorId", getInstructorPublicCourses);

// Update course
router.put(
  "/:id",
  verifyToken,
  restrictTo("instructor", "admin"),
  upload.single("thumbnail"),
  updateCourse
);

// Delete course
router.delete(
  "/:id",
  verifyToken,
  restrictTo("instructor", "admin"),
  deleteCourse
);

module.exports = router;
