const router = require("express").Router();
const { signup, login, logout } = require("../controllers/auth.controllers");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout); // Changed from GET to POST
router.get("/logout", logout);  // Keep GET for backward compatibility

module.exports = router;
