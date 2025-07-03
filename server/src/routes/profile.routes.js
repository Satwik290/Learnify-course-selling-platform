const router = require("express").Router();
const { getProfile, updateProfile } = require("../controllers/profile.controllers");
const { verifyToken } = require("../middlewares/auth.middlewares");

router.get("/me", verifyToken, getProfile);
router.put("/edit", verifyToken, updateProfile);

module.exports = router;
