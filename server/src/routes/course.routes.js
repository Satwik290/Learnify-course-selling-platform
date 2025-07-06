const express = require("express");
const router = express.Router();

// 👇 Import controller & middlewares
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/course.controllers");

const { upload } = require("../middlewares/upload.middlewares");
const { verifyToken } = require("../middlewares/auth.middlewares");
const { restrictTo } = require("../middlewares/role.middleware"); // ✅ RBAC middleware

// 👇 Create a new course (instructor or admin only)
router.post(
  "/",
  verifyToken,
  restrictTo("instructor", "admin"),     // ✅ Role check
  upload.single("thumbnail"),
  createCourse
);

// ✅ Get all courses (public)
router.get("/", getAllCourses);

// ✅ Get single course by ID (public)
router.get("/:id", getCourseById);

// 👇 Update course (only instructor/admin)
router.put(
  "/:id",
  verifyToken,
  restrictTo("instructor", "admin"),     // ✅ Role check
  upload.single("thumbnail"),
  updateCourse
);

// 👇 Delete course (only instructor/admin)
router.delete(
  "/:id",
  verifyToken,
  restrictTo("instructor", "admin"),     // ✅ Role check
  deleteCourse
);

module.exports = router;
