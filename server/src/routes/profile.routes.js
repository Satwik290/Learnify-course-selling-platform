const router = require("express").Router();
const { getProfile, updateProfile, getEnrolledCourses  } = require("../controllers/profile.controllers");
const { verifyToken } = require("../middlewares/auth.middlewares");

router.get("/me", verifyToken, getProfile);
router.put("/edit", verifyToken, updateProfile);
router.get("/enrolled", verifyToken, getEnrolledCourses);


module.exports = router;
