import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

//! Login User:
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password!",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    const { password: _, ...userData } = user._doc;

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: userData,
    });
  } catch (error) {
    console.error(`Internal Server Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export { login };
