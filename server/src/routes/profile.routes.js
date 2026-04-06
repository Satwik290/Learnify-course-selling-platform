const router = require("express").Router();
const { 
  getProfile, 
  updateProfile, 
  getEnrolledCourses, 
  deleteAccount 
} = require("../controllers/profile.controllers");
const { verifyToken } = require("../middlewares/auth.middlewares");

// Frontend calls: GET /api/profile/view
router.get("/view", verifyToken, getProfile);
router.get("/me", verifyToken, getProfile); // Keep old route

// Frontend calls: PUT /api/profile/update
router.put("/update", verifyToken, updateProfile);
router.put("/edit", verifyToken, updateProfile); // Keep old route

// Frontend calls: GET /api/profile/enrolled-courses
router.get("/enrolled-courses", verifyToken, getEnrolledCourses);
router.get("/enrolled", verifyToken, getEnrolledCourses); // Keep old route

// DELETE account
router.delete("/delete-account", verifyToken, deleteAccount);

module.exports = router;
