const express = require("express");
const router = express.Router();
const {
  enrollInCourse,
  getMyEnrollments,
  unenrollCourse,
} = require("../controllers/enrollment.controllers");
const { verifyToken } = require("../middlewares/auth.middlewares");

router.post("/:courseId", verifyToken, enrollInCourse);
router.get("/my", verifyToken, getMyEnrollments);
router.delete("/:courseId", verifyToken, unenrollCourse);

module.exports = router;
