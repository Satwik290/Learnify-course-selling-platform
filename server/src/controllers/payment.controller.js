const Course = require("../model/Course");
const User = require("../model/user");

exports.handlePaymentAndEnroll = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Prevent duplicate enrollment
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ error: "Already enrolled in this course" });
    }

    // Enroll user
    user.enrolledCourses.push(courseId);
    await user.save();

    res.status(200).json({
      message: "✅ Payment successful, course enrolled",
      course,
    });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
