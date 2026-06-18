require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Template = require("../../model/Template");
const Rating = require("../../model/Rating");

const crypto = require("crypto");
const User = require("../../model/User");

// ─── USER REGISTER ────────────────────────────────────────────────────
// POST http://localhost:5000/userapi/register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ regsts: 1, msg: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPassword });
    const newUser = await user.save();
    res.json({ regsts: 0, msg: "Registration successful", newUser });
  } catch (error) {
    res.json({ regsts: 2, msg: "Registration failed", error });
  }
};

// ─── USER LOGIN ───────────────────────────────────────────────────────
// POST http://localhost:5000/userapi/login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ logsts: 1, msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ logsts: 2, msg: "Invalid password" });

    const token = jwt.sign(
      { userid: user._id, role: "user", useremail: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // ✅ 7 days so it doesn't expire quickly
    );
    res.json({
      logsts: 0,
      msg: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.json({ logsts: 3, msg: "Login error", error });
  }
};

// ─── GET CURRENT USER ─────────────────────────────────────────────────
// GET http://localhost:5000/api/user/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userid).select("-password")
    if (!user) return res.status(404).json({ message: "User not found" })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

// ─── UPDATE USER ──────────────────────────────────────────────────────
// PUT http://localhost:5000/userapi/update/:id
// PUT http://localhost:5000/api/user/update/:id
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, email: req.body.email, mobile: req.body.mobile },
      { new: true, select: "-password" }
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found" })
    res.json({ msg: "User updated successfully", updatedUser });
  } catch (err) {
    res.json({ msg: "User update failed", err });
  }
};

// ─── CHANGE PASSWORD ──────────────────────────────────────────────────
// POST http://localhost:5000/api/user/change-password/:id
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: "User not found" })

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" })

    const hashed = await bcrypt.hash(newPassword, 12)
    await User.findByIdAndUpdate(req.params.id, { password: hashed })
    res.json({ success: true, message: "Password changed successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

// ─── FIND ALL APPROVED TEMPLATES ──────────────────────────────────────
// GET http://localhost:5000/userapi/templates
exports.findAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ designStatus: "approved" })
      .populate("designCategory", "name")
      .populate("vendorId", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── FIND TEMPLATES BY CATEGORY ───────────────────────────────────────
// GET http://localhost:5000/userapi/templates/category/:categoryId
exports.findTemplatesByCategory = async (req, res) => {
  try {
    const templates = await Template.find({
      designStatus: "approved",
      designCategory: req.params.categoryId
    })
      .populate("designCategory", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── FIND LATEST 10 TEMPLATES ─────────────────────────────────────────
// GET http://localhost:5000/userapi/templates/latest
exports.findLatestTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ designStatus: "approved" })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("designCategory", "name")
      .populate("vendorId", "name email");
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET RATINGS FOR A TEMPLATE ───────────────────────────────────────
// GET http://localhost:5000/userapi/ratings/:templateId
exports.getRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ templateId: req.params.templateId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// ─── SUBMIT / UPDATE RATING ───────────────────────────────────────────
// POST http://localhost:5000/userapi/rate/:templateId
// In userController.js — update submitRating
exports.submitRating = async (req, res) => {
  try {
    const { rating, review, complaint } = req.body  // ✅ add complaint
    const templateId = req.params.templateId
    const userId = req.user.userid

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" })
    }

    const template = await Template.findById(templateId)
    if (!template) return res.status(404).json({ message: "Template not found" })

    const existing = await Rating.findOne({ templateId, userId })
    if (existing) {
      existing.rating = rating
      existing.review = review || ""
      existing.complaint = complaint || ""  // ✅ save complaint
      if (complaint && complaint.trim()) {
        existing.complaintStatus = "open"   // ✅ mark as open
      }
      await existing.save()
      return res.json({ message: "Rating updated", rating: existing })
    }

    const newRating = await Rating.create({
      templateId,
      userId,
      rating,
      review: review || "",
      complaint: complaint || "",                                    // ✅
      complaintStatus: complaint && complaint.trim() ? "open" : "none",   // ✅
    })
    res.json({ message: "Rating submitted", rating: newRating })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: "Email is required" })

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) return res.status(404).json({ message: "No account found with this email" })

    const token     = crypto.randomBytes(32).toString("hex")
    const expiresAt = Date.now() + 30 * 60 * 1000

    user.resetPasswordToken   = token
    user.resetPasswordExpires = expiresAt
    await user.save()

    // ✅ Log reset URL to console only — not sent to frontend
    const resetUrl = `http://localhost:5173/reset-password/${token}`
    console.log("🔗 Password Reset URL:", resetUrl)

    res.json({
      success: true,
      message: "Password reset link has been sent to your email.",
    })
  } catch (err) {
    console.log("forgotPassword error:", err)
    res.status(500).json({ message: err.message })
  }
}

// ── RESET PASSWORD — verify token, save new password ─────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { token }       = req.params
    const { newPassword } = req.body

    if (!token)       return res.status(400).json({ message: "Token is required" })
    if (!newPassword) return res.status(400).json({ message: "New password is required" })
    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" })

    // find user with this token that has not expired
    const user = await User.findOne({
      resetPasswordToken:   token,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({
        message: "Reset link is invalid or has expired. Please request a new one.",
      })
    }

    // hash and save new password
    const hashed = await bcrypt.hash(newPassword, 10)
    user.password             = hashed
    user.resetPasswordToken   = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.json({ success: true, message: "Password reset successful. You can now log in." })
  } catch (err) {
    console.log("resetPassword error:", err)
    res.status(500).json({ message: err.message })
  }
}
