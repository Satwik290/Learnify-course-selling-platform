const Enrollment = require("../model/Enrollment");
const Course = require("../model/Course");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.enrollInCourse = asyncHandler(async (req, res) => {
  const existing = await Enrollment.findOne({
    user: req.user?._id,
    course: req.params.courseId,
  });

  if (existing) {
    throw new ApiError(400, "Already enrolled in this course");
  }

  const enrollment = await Enrollment.create({
    user: req.user?._id,
    course: req.params.courseId,
  });

  if (!enrollment) {
    throw new ApiError(500, "Failed to enroll in the course");
  }

  // ✅ Sync cached enrollment count
  await Course.syncEnrollmentCount(req.params.courseId);

  return res.status(201).json({
    success: true,
    message: "Enrolled successfully",
    enrollment,
  });
});

exports.getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ user: req.user?._id }).populate("course");
  
  if (!enrollments) {
    throw new ApiError(404, "No enrollments found");
  }

  const courses = enrollments.map((e) => e.course);

  return res.status(200).json({
    success: true,
    message: "Enrollments fetched successfully",
    enrolledCourses: courses,
  });
});

exports.unenrollCourse = asyncHandler(async (req, res) => {
  const removed = await Enrollment.findOneAndDelete({
    user: req.user?._id,
    course: req.params.courseId,
  });

  if (!removed) {
    throw new ApiError(404, "You are not enrolled in this course");
  }

  // ✅ Sync cached enrollment count
  await Course.syncEnrollmentCount(req.params.courseId);

  return res.status(200).json({
    success: true,
    message: "Unenrolled successfully",
  });
});
