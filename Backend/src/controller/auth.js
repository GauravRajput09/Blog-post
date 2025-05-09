const User = require("../models/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

require("dotenv").config();

//signup
const signup = async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;
  try {
    if (!name || !email || !password || !confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    // Confirm password
    if (password !== confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      confirmpassword: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    const passwordIsMatch = await bcrypt.compare(password, user.password);
    if (!passwordIsMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Sign the JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Forgot Password Controller
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    // const resetUrl = `http://localhost:5173/reset-password/${token}`;
    // Backend reset email sending logic (Node.js example)
    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    try {
      await transporter.sendMail({
        to: user.email,
        subject: "Password Reset",
        html: `<p>Click The Link For Reset Password <a href="${resetUrl}">here</a> to reset your password. Valid for 1 hour.</p>`,
      });

      res
        .status(200)
        .json({ success: true, message: "Reset link sent to email" });
    } catch (emailError) {
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();

      console.error("Email sending error:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send reset email",
        error: emailError.message,
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmpassword } = req.body;

    if (!password || !confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirmation are required",
      });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Debug token
    console.log("Reset password token received:", token);

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      console.log("No user found or token expired");
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    if ("confirmpassword" in user) {
      user.confirmpassword = hashedPassword;
    }

    // Clear token field
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    console.log("Password successfully reset for:", user.email);

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
      error: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  logout,
};
