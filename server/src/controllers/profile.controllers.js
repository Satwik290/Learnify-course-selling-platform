const User = require("../model/user");

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json({ user });
};

exports.updateProfile = async (req, res) => {
  const updates = req.body;
  const updated = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  res.json({ user: updated });
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate("enrolledCourses", "title thumbnail price") // Limit exposed fields
      .select("firstName lastName enrolledCourses");

    res.status(200).json({
      message: "Fetched enrolled courses",
      enrolledCourses: user.enrolledCourses,
    });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};