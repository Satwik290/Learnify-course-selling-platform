const Course = require("../model/Course");
const User = require("../model/user");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.handlePaymentAndEnroll = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const courseId = req.params.courseId;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Prevent duplicate enrollment
  if (user.enrolledCourses.includes(courseId)) {
    throw new ApiError(400, "Already enrolled in this course");
  }

  // Simulate a delay for payment processing
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Enroll user
  user.enrolledCourses.push(courseId);
  await user.save();

  return res.status(200).json({
    success: true,
    message: "✅ Mock payment successful, course enrolled",
    course,
  });
});
