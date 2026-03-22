const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendEmail } = require("../utils/brevoMailer");
const router = express.Router();
const crypto = require("crypto");
const strongPassword = (p) =>
  typeof p === "string" &&
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/.test(p);

/* =====================
   REGISTER API
   POST /api/auth/register
===================== */
router.post("/register", async (req, res) => {
  console.log("Register route hit");
  console.log("REQ BODY:", req.body);

  const { firstname, lastname, email, password } = req.body || {};

  // Validation
  if (!firstname || !email || !password) {
    return res.status(400).json({
      message: "Firstname, email, and password are required"
    });
  }

  try {
    const emailLower = email.toLowerCase().trim();

    // ✅ Check if user already exists (case insensitive)
    const existingUser = await User.findOne({ email: emailLower });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    if (!strongPassword(password)) {
      return res.status(400).json({
        message: "Password must be 12+ chars with upper, lower, number, symbol"
      });
    }

    // ✅ Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const user = new User({
      firstname,
      lastname,
      email: emailLower,
      password: passwordHash
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
});


/* =====================
   LOGIN API
   POST /api/auth/login
===================== */
router.post("/login", async (req, res) => {
  console.log("Login route hit");

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  try {
    const emailLower = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailLower });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // 🔥 Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP and expiry (5 minutes)
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    console.log("Generated OTP:", otp);

    // Send OTP email
    try {
  await sendEmail(
  user.email,
  "Your Login OTP - DeepShield",
  `<h2>Your OTP is ${otp}</h2><p>It expires in 5 minutes.</p>`
);

  console.log("OTP email sent");
} catch (mailError) {
  console.error("EMAIL SEND ERROR:", mailError.message);
}

    res.status(200).json({
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      message: "Email and OTP are required"
    });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user || user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    // Clear OTP
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // 🔐 Generate JWT after OTP verification
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
});

/* =====================
   FORGOT PASSWORD
   POST /api/auth/forgot-password
===================== */
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    // Respond generically to avoid user enumeration
    if (!user) {
      return res.json({ message: "If this email exists, a reset link was sent" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const link = `${clientUrl}/reset-password/${token}`;

    try {
      await sendEmail(
        user.email,
        "Reset your DeepShield password",
        `
        <h2>Password Reset Request</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${link}" 
        style="background:#6d28d9;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
          Reset Password
        </a>
        <p>This link expires in 15 minutes.</p>
      `
    );
      console.log("Reset email sent");
    } catch (e) {
      console.error("Reset email send error:", e.message);
    }
    if (process.env.NODE_ENV !== "production") {
      console.log("Password reset link:", link);
    }
    return res.json({ message: "If this email exists, a reset link was sent" });
  } catch (e) {
    console.error("FORGOT PASSWORD ERROR:", e.message);
    return res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   RESET PASSWORD
   POST /api/auth/reset-password/:token
===================== */
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body || {};
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  if (!strongPassword(password)) {
    return res.status(400).json({
      message: "Password must be 12+ chars with upper, lower, number, symbol"
    });
  }
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const hash = await bcrypt.hash(password, 10);
    user.password = hash;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();
    return res.json({ message: "Password updated successfully" });
  } catch (e) {
    console.error("RESET PASSWORD ERROR:", e.message);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
