const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// 1. REGISTER: Module 1 (POST /register & POST /auth/register)
router.post(["/register", "/auth/register", "/api/register"], async (req, res) => {
  try {
    const { name, email, password, department, semester, role, phone, userId, adminSecretKey } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email is already registered" });
    }

    // Secure Admin Registration Authorization Check
    let assignedRole = "student";
    if (role === "admin") {
      const validAdminSecret = process.env.ADMIN_REGISTRATION_SECRET || "ABC_ADMIN_SECURE_2026";
      const providedSecret = (adminSecretKey || "").trim();
      if (!providedSecret || providedSecret !== validAdminSecret) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: Invalid administrative authorization code. Admin registration requires a valid institutional passkey.",
        });
      }
      assignedRole = "admin";
    }

    const user = await User.create({
      userId: userId || undefined,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: assignedRole,
      department: department || "Computer Science",
      semester: Number(semester) || 1,
      phone: phone || "",
    });

    const token = signToken(user);

    res.status(201).json({
      success: true,
      message: `${assignedRole === "admin" ? "Administrator" : "Student"} registration successful!`,
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        semester: user.semester,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. LOGIN: Module 2 (POST /login & POST /auth/login)
router.post(["/login", "/auth/login", "/api/login"], async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Role Enforcement: prevent student from logging in through admin portal or vice versa
    if (role && user.role !== role) {
      if (role === "admin" && user.role === "student") {
        return res.status(403).json({
          success: false,
          message: "Access denied: Student accounts cannot log in through Admin Login. Please use Student Login.",
        });
      }
      if (role === "student" && user.role === "admin") {
        return res.status(403).json({
          success: false,
          message: "Access denied: Administrator accounts must log in through Admin Login.",
        });
      }
    }

    const token = signToken(user);

    res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        semester: user.semester,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. GET CURRENT PROFILE (GET /profile & GET /auth/me)
router.get(["/profile", "/auth/me", "/api/profile"], requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. UPDATE PROFILE: Student User Role (PUT /profile & PUT /auth/profile)
router.put(["/profile", "/auth/profile", "/api/profile"], requireAuth, async (req, res) => {
  try {
    const { name, department, semester, phone, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name) user.name = name.trim();
    if (department) user.department = department.trim();
    if (semester) user.semester = Number(semester);
    if (phone !== undefined) user.phone = phone.trim();

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: "Current password is required to change password" });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Incorrect current password" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
      }
      user.password = newPassword;
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        semester: user.semester,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. FORGOT PASSWORD
router.post(["/auth/forgot-password", "/forgot-password"], async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Please provide your registered email address" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No registered account found with that email address.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const clientOrigin = req.headers.origin || process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${clientOrigin.replace(/\/+$/, "")}/reset-password/${resetToken}`;

    res.json({
      success: true,
      message: "Password reset link generated successfully!",
      resetUrl,
      resetToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to generate reset link: " + error.message });
  }
});

// 6. RESET PASSWORD
router.post(["/auth/reset-password/:token", "/reset-password/:token"], async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password reset link is invalid or has expired.",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successful! You can now log in with your new password.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
