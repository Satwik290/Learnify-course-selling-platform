const User = require("../model/user");
const { signupSchema, loginSchema } = require("../utlis/validators");

exports.signup = async (req, res) => {
  try {
    const data = signupSchema.parse(req.body);
    const user = await User.create(data);
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await User.findOne({ email: data.email });
    const isMatch = await user?.isValidPassword(data.password);

    if (!user || !isMatch)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = user.generateJWT();
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        maxAge: 8 * 60 * 60 * 1000,
      })
      .json({ message: "Login successful" });
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
};
