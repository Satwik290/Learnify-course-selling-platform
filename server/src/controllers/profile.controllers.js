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
