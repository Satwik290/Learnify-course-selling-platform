const User = require("../model/user");
const Course = require("../model/Course");
const Enrollment = require("../model/Enrollment");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    user
  });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(
    req.user?._id, 
    updates, 
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    throw new ApiError(404, "User not found or update failed");
  }

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user
  });
});

exports.getEnrolledCourses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id)
    .populate("enrolledCourses", "title thumbnail price")
    .select("firstName lastName enrolledCourses");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json({
    success: true,
    message: "Enrolled courses fetched successfully",
    enrolledCourses: user.enrolledCourses,
  });
});

exports.deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Cleanup:
  // 1. If instructor, delete their courses and associated enrollments
  const courses = await Course.find({ creator: userId });
  const courseIds = courses.map(c => c._id);
  
  await Enrollment.deleteMany({ course: { $in: courseIds } });
  await Course.deleteMany({ creator: userId });

  // 2. Delete their own enrollments
  await Enrollment.deleteMany({ user: userId });

  // 3. Delete the user
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Clear cookie
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  return res.status(200).json({
    success: true,
    message: "Account and associated data deleted successfully",
  });
});