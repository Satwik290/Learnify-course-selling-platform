const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minLength: 3 },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Invalid email"],
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (val) => validator.isStrongPassword(val, { minSymbols: 0 }),
      message: "Weak password",
    },
  },
  age: { type: Number, min: 18 },
  gender: { type: String, enum: ["male", "female", "other"] },
  photoUrl: {
    type: String,
    default: "https://i.ibb.co/4pDNDk1/avatar.png",
    validate: [validator.isURL, "Invalid URL"],
  },
  about: { type: String, default: "No bio provided" },
  skills: [String],
  role: {
    type: String,
    enum: ["admin", "student", "instructor"],
    default: "student",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isValidPassword = function (pwd) {
  return bcrypt.compare(pwd, this.password);
};

userSchema.methods.generateJWT = function () {
  return jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
