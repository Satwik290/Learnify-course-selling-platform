const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { PORT } = require("./config/env");

const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const courseRoutes = require("./routes/course.routes");

const app = express();

// 🌐 Middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Use your frontend URL here
app.use(express.json());
app.use(cookieParser());

// 📦 Static folder for uploaded files
app.use("/uploads", express.static("src/uploads"));

// 🔗 Connect to database
connectDB();

// 🛣️ Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/courses", courseRoutes);

// 🔍 Test route
app.get("/", (req, res) => {
  res.send("Welcome to Learnify API 🚀");
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
