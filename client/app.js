const express = require("express");
const path = require("path");
const app = express();

// Settings
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Routes
const clientRoutes = require("./routes/client.routes");
app.use("/", clientRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Client running on http://localhost:${PORT}`));
