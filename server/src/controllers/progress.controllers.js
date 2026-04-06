const Enrollment = require("../model/Enrollment");
const Course = require("../model/Course");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

// ✅ Toggle lesson completion
exports.toggleLessonProgress = asyncHandler(async (req, res) => {
  const { courseId, lessonId } = req.params;
  const userId = req.user._id;

  const enrollment = await Enrollment.findOne({ user: userId, course: courseId });

  if (!enrollment) {
    throw new ApiError(403, "You are not enrolled in this course");
  }

  const isCompleted = enrollment.completedLessons.includes(lessonId);

  if (isCompleted) {
    // Unmark as complete
    enrollment.completedLessons = enrollment.completedLessons.filter(
      (id) => id.toString() !== lessonId
    );
  } else {
    // Mark as complete
    enrollment.completedLessons.push(lessonId);
  }

  await enrollment.save();

  res.status(200).json({
    success: true,
    message: isCompleted ? "Lesson unmarked as complete" : "Lesson marked as complete",
    completedLessons: enrollment.completedLessons
  });
});

// ✅ Get course progress percentage
exports.getCourseProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  const [enrollment, course] = await Promise.all([
    Enrollment.findOne({ user: userId, course: courseId }),
    Course.findById(courseId)
  ]);

  if (!enrollment) {
    throw new ApiError(403, "You are not enrolled in this course");
  }

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // Count total lessons
  let totalLessons = 0;
  course.sections.forEach(section => {
    totalLessons += section.lessons.length;
  });

  const completedCount = enrollment.completedLessons.length;
  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  res.status(200).json({
    success: true,
    progress: {
      completedCount,
      totalLessons,
      percentage,
      completedLessons: enrollment.completedLessons
    }
  });
});
