const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { verifyToken } = require("../middlewares/auth.middlewares");
const { restrictTo } = require("../middlewares/role.middleware");

// ✅ Update user role (admin only)
router.patch("/role/:userId", verifyToken, restrictTo("admin"), async (req, res) => {
  try {
    const { role } = req.body;

    if (!["admin", "student", "instructor"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User role updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user role" });
  }
});

// ✅ View all users (admin only)
router.get("/users", verifyToken, restrictTo("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
