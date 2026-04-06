const express = require("express");
const router = express.Router();

const User = require("../model/user");
const Course = require("../model/Course");
const Enrollment = require("../model/Enrollment");
const { verifyToken } = require("../middlewares/auth.middlewares");
const { restrictTo } = require("../middlewares/role.middleware");
const asyncHandler = require("../utils/asyncHandler");

// ✅ Update user role (admin only)
router.patch("/role/:userId", verifyToken, restrictTo("admin"), asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!["admin", "student", "instructor"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { role },
    { new: true }
  ).select("-password");

  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ success: true, message: "User role updated", user });
}));

// ✅ View all users (admin only)
router.get("/users", verifyToken, restrictTo("admin"), asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.status(200).json({ success: true, users });
}));

// ✅ DELETE User (admin only)
router.delete("/user/:userId", verifyToken, restrictTo("admin"), asyncHandler(async (req, res) => {
  if (req.params.userId === req.user._id.toString()) {
    return res.status(400).json({ error: "You cannot delete your own admin account" });
  }

  const user = await User.findByIdAndDelete(req.params.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  // Cleanup: Remove enrollments by this user
  await Enrollment.deleteMany({ user: req.params.userId });

  res.status(200).json({ success: true, message: "User and associated data deleted" });
}));

// ✅ Platform Statistics (admin only)
router.get("/stats", verifyToken, restrictTo("admin"), asyncHandler(async (req, res) => {
  const [totalUsers, totalCourses, totalEnrollments] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Enrollment.countDocuments()
  ]);

  // Roles breakdown
  const roles = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } }
  ]);

  // Category breakdown
  const categories = await Course.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalCourses,
      totalEnrollments,
      roles: roles.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
      categories: categories.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {})
    }
  });
}));

// ✅ View all courses (admin only)
router.get("/courses", verifyToken, restrictTo("admin"), asyncHandler(async (req, res) => {
  const courses = await Course.find()
    .populate("creator", "firstName lastName email")
    .sort({ createdAt: -1 });
    
  res.status(200).json({ success: true, courses });
}));

// ✅ DELETE Course (admin only)
router.delete("/course/:courseId", verifyToken, restrictTo("admin"), asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.courseId);
  if (!course) return res.status(404).json({ error: "Course not found" });

  // Cleanup: Remove enrollments for this course
  await Enrollment.deleteMany({ course: req.params.courseId });

  res.status(200).json({ success: true, message: "Course and associated enrollments deleted" });
}));

// ✅ Instructor Performance Breakdown (admin only)
router.get("/instructors-performance", verifyToken, restrictTo("admin"), asyncHandler(async (req, res) => {
  const instructors = await User.find({ role: "instructor" }).select("firstName lastName email photoUrl");
  
  const performance = await Promise.all(instructors.map(async (inst) => {
    const stats = await Enrollment.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseInfo"
        }
      },
      { $unwind: "$courseInfo" },
      {
        $match: {
          "courseInfo.creator": inst._id
        }
      },
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          totalRevenue: { $sum: "$courseInfo.price" }
        }
      }
    ]);

    const result = stats[0] || { totalStudents: 0, totalRevenue: 0 };
    const courses = await Course.countDocuments({ creator: inst._id });

    return {
      _id: inst._id,
      firstName: inst.firstName,
      lastName: inst.lastName,
      email: inst.email,
      photoUrl: inst.photoUrl,
      totalCourses: courses,
      totalStudents: result.totalStudents,
      totalRevenue: result.totalRevenue
    };
  }));

  res.status(200).json({ success: true, performance });
}));

module.exports = router;
