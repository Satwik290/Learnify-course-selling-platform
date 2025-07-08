const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Learnify - Home" });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard", { title: "Dashboard" });
});

router.get("/course", (req, res) => {
  res.render("course", { title: "Course Details" });
});

module.exports = router;
