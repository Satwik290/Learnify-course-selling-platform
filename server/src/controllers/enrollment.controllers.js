const Enrollment = require("../model/Enrollment");

// Enroll in course
exports.enrollInCourse = async (req, res) => {
  try {
    const existing = await Enrollment.findOne({
      user: req.user._id,
      course: req.params.courseId,
    });

    if (existing) {
      return res.status(400).json({ error: "Already enrolled in this course" });
    }

    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: req.params.courseId,
    });

    res.status(201).json({ message: "Enrolled successfully", enrollment });
  } catch (err) {
    res.status(500).json({ error: "Enrollment failed" });
  }
};

// View enrolled courses
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id }).populate("course");
    const courses = enrollments.map((e) => e.course);
    res.status(200).json({ enrolledCourses: courses });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch enrolled courses" });
  }
};

// Unenroll from course
exports.unenrollCourse = async (req, res) => {
  try {
    const removed = await Enrollment.findOneAndDelete({
      user: req.user._id,
      course: req.params.courseId,
    });

    if (!removed) {
      return res.status(404).json({ error: "You are not enrolled in this course" });
    }

    res.status(200).json({ message: "Unenrolled successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to unenroll" });
  }
};
