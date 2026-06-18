const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const crypto = require("crypto");
const VendorModel = require("../../model/Vendor");
const Category    = require("../../model/Category");

// VENDOR REGISTER
exports.register = async (req, res) => {
  const { name, email, password, mobile, address } = req.body;
  try {
    const existingVendor = await VendorModel.findOne({ email });
    if (existingVendor) return res.json({ regsts: 1, msg: "Email already registered" });
    const hashedPassword = await bcrypt.hash(password, 12);
    const vendor = new VendorModel({ name, email, password: hashedPassword, mobile, address, status: "enable" });
    const newVendor = await vendor.save();
    res.json({ regsts: 0, msg: "Developer registration successful", newVendor });
  } catch (error) {
    res.json({ regsts: 1, msg: "Developer registration failed", error });
  }
};

// VENDOR LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const vendor = await VendorModel.findOne({ email });
    if (!vendor) return res.json({ msg: "Invalid email" });
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) return res.json({ msg: "Invalid password" });
    const token = jwt.sign(
      { vendorId: vendor._id, role: "vendor" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ msg: "Login successful", token, vendor: { id: vendor._id, name: vendor.name, email: vendor.email } });
  } catch (error) {
    res.json({ msg: "Login failed", error });
  }
};

// ✅ FORGOT PASSWORD — generates reset token, logs link to console only
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const vendor = await VendorModel.findOne({ email });
    if (!vendor) return res.status(404).json({ message: "No vendor found with this email" });

    // generate a random reset token
    const resetToken  = crypto.randomBytes(32).toString("hex")
    const tokenExpiry = Date.now() + 30 * 60 * 1000 // 30 minutes

    // save token + expiry on vendor
    vendor.resetPasswordToken  = resetToken
    vendor.resetPasswordExpiry = tokenExpiry
    await vendor.save()

    // ✅ log the reset link to console only — no email sent
    const resetLink = `http://localhost:5173/vendor/reset-password/${resetToken}`
    console.log("====================================")
    console.log("VENDOR PASSWORD RESET LINK (console only):")
    console.log(resetLink)
    console.log("====================================")

    // tell frontend "email sent" without actually sending
    res.json({
      success: true,
      message: "Password reset link has been sent to your email"
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ✅ RESET PASSWORD — validates token from URL params and updates password
exports.resetPassword = async (req, res) => {
  try {
    const { token }       = req.params
    const { newPassword } = req.body

    if (!newPassword) return res.status(400).json({ message: "New password is required" })
    if (newPassword.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" })

    // find vendor with matching token that is not expired
    const vendor = await VendorModel.findOne({
      resetPasswordToken:  token,
      resetPasswordExpiry: { $gt: Date.now() }
    })

    if (!vendor) return res.status(400).json({ message: "Reset link is invalid or has expired" })

    // update password and clear reset fields
    vendor.password             = await bcrypt.hash(newPassword, 10)
    vendor.resetPasswordToken   = undefined
    vendor.resetPasswordExpiry  = undefined
    await vendor.save()

    res.json({ success: true, message: "Password reset successfully. You can now log in." })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// UPDATE VENDOR
exports.updateVendor = async (req, res) => {
  try {
    const updatedVendor = await VendorModel.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, email: req.body.email, mobile: req.body.mobile },
      { returnDocument: "after" }
    );
    res.json({ msg: "Vendor updated successfully", updatedVendor });
  } catch (err) {
    res.json({ msg: "Vendor update failed", err });
  }
};

// VIEW CATEGORIES
exports.viewCategory = async (req, res) => {
  try {
    const categories = await Category.find({ status: "enable" });
    res.status(200).json({ message: "Categories fetched successfully", categories });
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};

// GET BANK DETAILS
exports.getBankDetails = async (req, res) => {
  try {
    const vendor = await VendorModel.findById(req.vendor.vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json({ bankDetails: vendor.bankDetails || null });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// SAVE BANK DETAILS
exports.saveBankDetails = async (req, res) => {
  try {
    const { accountHolder, accountNumber, ifscCode, bankName, branchName, upiId, panCard } = req.body;
    const vendor = await VendorModel.findByIdAndUpdate(
      req.vendor.vendorId,
      { bankDetails: { accountHolder, accountNumber, ifscCode, bankName, branchName, upiId, panCard } },
      { returnDocument: "after" }
    );
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json({ success: true, message: "Bank details saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET MY ORDERS
exports.getMyOrders = async (req, res) => {
  try {
    const Order    = require("../../model/Order");
    const Template = require("../../model/Template");
    const vendorId = req.vendor.vendorId;
    const myTemplates   = await Template.find({ vendorId }).select("_id");
    const myTemplateIds = myTemplates.map(t => t._id.toString());
    const orders = await Order.find({ "items.templateId": { $in: myTemplateIds } })
      .populate("userId", "name email")
      .populate({
        path:     "items.templateId",
        select:   "designName designThumbnail regularPrice designCategory",
        populate: { path: "designCategory", select: "name" }
      })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET VENDOR PROFILE
exports.getVendorProfile = async (req, res) => {
  try {
    const vendor = await VendorModel.findById(req.vendor.vendorId).select("-password");
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json({ vendor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const vendor = await VendorModel.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    const isMatch = await bcrypt.compare(currentPassword, vendor.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });
    vendor.password = await bcrypt.hash(newPassword, 10);
    await vendor.save();
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── VENDOR FORGOT PASSWORD ──────────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: "Email is required" })

    const vendor = await VendorModel.findOne({ email: email.toLowerCase().trim() })
    if (!vendor) return res.status(404).json({ message: "No vendor account found with this email" })

    const token     = crypto.randomBytes(32).toString("hex")
    const expiresAt = Date.now() + 30 * 60 * 1000   // 30 minutes

    // ✅ use resetPasswordToken + resetPasswordExpires (consistent naming)
    vendor.resetPasswordToken   = token
    vendor.resetPasswordExpires = expiresAt
    await vendor.save()

    const resetUrl = `http://localhost:5173/vendor/reset-password/${token}`
    console.log("=================================================")
    console.log("VENDOR RESET LINK:", resetUrl)
    console.log("=================================================")

    res.json({
      success: true,
      message: "Password reset link has been sent to your email address.",
    })
  } catch (err) {
    console.log("vendor forgotPassword error:", err.message)
    res.status(500).json({ message: err.message })
  }
}

// ── VENDOR RESET PASSWORD ───────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { token }       = req.params
    const { newPassword } = req.body

    if (!token)       return res.status(400).json({ message: "Token is required" })
    if (!newPassword) return res.status(400).json({ message: "New password is required" })
    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" })

    // ✅ FIXED: use resetPasswordExpires (not resetPasswordExpiry)
    const vendor = await VendorModel.findOne({
      resetPasswordToken:   token,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!vendor) {
      return res.status(400).json({
        message: "Reset link is invalid or has expired. Please request a new one.",
      })
    }

    vendor.password             = await bcrypt.hash(newPassword, 10)
    vendor.resetPasswordToken   = undefined
    vendor.resetPasswordExpires = undefined
    await vendor.save()

    res.json({ success: true, message: "Password reset successful. You can now log in." })
  } catch (err) {
    console.log("vendor resetPassword error:", err.message)
    res.status(500).json({ message: err.message })
  }
}