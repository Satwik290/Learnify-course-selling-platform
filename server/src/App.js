const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { PORT } = require("./config/env");

const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const courseRoutes = require("./routes/course.routes");
const enrollmentRoutes = require("./routes/enroll.routes");
const adminRoutes = require("./routes/admin.routes");
const paymentRoutes = require("./routes/payment.routes");


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// 🌐 Middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Use your frontend URL here
app.use(express.json());
app.use(cookieParser());

// 📦 Static folder for uploaded files
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

// 🔗 Connect to database
connectDB();

// 🛣️ Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enroll", enrollmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);


// 🔍 Test route
app.get("/", (req, res) => {
  res.send("Welcome to Learnify API 🚀");
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
