const mongoose = require('mongoose');
require("dotenv").config(); // ✅ this line loads the .env file


const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is undefined. Please check your .env file.");
    }
    await mongoose.connect(uri);
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    // Exit process with failure
    process.exit(1); 
  }
};

module.exports = connectDB;