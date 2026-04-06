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

  if (!user) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    user
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
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
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("token", options)
    .json({
      success: true,
      message: "User logged out"
    });
});
