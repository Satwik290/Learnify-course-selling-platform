const User = require("../model/user");
const { signupSchema, loginSchema } = require("../utils/validators");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.signup = asyncHandler(async (req, res) => {
  const validation = signupSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw new ApiError(400, "Validation Error", validation.error.errors);
  }

  const { email } = validation.data;
  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const user = await User.create(validation.data);
  const token = user.generateJWT();

  const options = {
    httpOnly: true,
    secure: true, // Force secure for cross-site cookies
    sameSite: "none", // Required for cross-domain (github.io to onrender.com)
    maxAge: 8 * 60 * 60 * 1000,
  };

  return res
    .status(201)
    .cookie("token", token, options)
    .json({
      success: true,
      message: "User registered successfully",
      user,
      token
    });
});

exports.login = asyncHandler(async (req, res) => {
  const validation = loginSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw new ApiError(400, "Validation Error", validation.error.errors);
  }

  const { email, password } = validation.data;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isValidPassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const token = user.generateJWT();

  const options = {
    httpOnly: true,
    secure: true, // Force secure for cross-site cookies
    sameSite: "none", // Required for cross-domain (github.io to onrender.com)
    maxAge: 8 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("token", token, options)
    .json({
      success: true,
      message: "User logged in successfully",
      user,
      token
    });
});

exports.logout = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(200)
    .clearCookie("token", options)
    .json({
      success: true,
      message: "User logged out"
    });
});
