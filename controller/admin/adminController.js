const bcrypt = require("bcryptjs")
const jwt    = require("jsonwebtoken")
const AdminModel    = require("../../model/Admin")
const CategoryModel = require("../../model/Category")
const VendorModel   = require("../../model/Vendor")
const UserModel     = require("../../model/User")
const Template      = require("../../model/Template")

const crypto = require("crypto")


// ─────────────────────────────────────────────
// ADMIN LOGIN
// POST /adminapi/login
// ─────────────────────────────────────────────
exports.login = async (req, res) => {
  const email    = req.body.email?.trim().toLowerCase()
  const password = req.body.password
  try {
    const admin = await AdminModel.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") }
    })
    if (!admin) return res.status(401).json({ status: 1, message: "Invalid email" })
    if (admin.status === "disable") return res.status(403).json({ status: 2, message: "Admin account is disabled" })

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) return res.status(401).json({ status: 3, message: "Invalid password" })

    const token = jwt.sign(
      { adminId: admin._id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET || "themematrix_secret",
      { expiresIn: "1h" }
    )
    res.status(200).json({
      status: 0,
      message: "Login successful",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, mobile: admin.mobile }
    })
  } catch (error) {
    res.status(500).json({ status: 4, message: "Server error", error: error.message })
  }
}

// ─────────────────────────────────────────────
// ADMIN REGISTER
// POST /adminapi/register
// ─────────────────────────────────────────────
exports.register = async (req, res) => {
  const uname  = req.body.uname
  const pwd    = await bcrypt.hash(req.body.pwd, 12)
  const email  = req.body.email?.trim().toLowerCase()
  const mobile = req.body.mobile
  try {
    const admin    = new AdminModel({ name: uname, password: pwd, email, mobile, status: "enable", addedBy: null })
    const newAdmin = await admin.save()
    res.json({ regsts: 0, msg: "Admin created successfully", newAdmin })
  } catch (error) {
    res.json({ regsts: 1, msg: "Admin creation failed", error })
  }
}

// ─────────────────────────────────────────────
// VIEW VENDORS
// GET /adminapi/vendors
// ─────────────────────────────────────────────
exports.viewVendors = async (req, res) => {
  try {
    const vendors = await VendorModel.find().select("-password")
    res.json(vendors)
  } catch (err) {
    res.json({ msg: "Failed to fetch vendors", err })
  }
}

// ─────────────────────────────────────────────
// VIEW USERS
// GET /adminapi/users
// ─────────────────────────────────────────────
exports.viewUsers = async (req, res) => {
  try {
    const users = await UserModel.find()
    res.json(users)
  } catch (err) {
    res.json({ msg: "Failed to fetch users", err })
  }
}

// ─────────────────────────────────────────────
// ADD CATEGORY
// POST /adminapi/category
// ─────────────────────────────────────────────
exports.addCategory = async (req, res) => {
  try {
    const category = new CategoryModel({ name: req.body.name, status: "enable", addedBy: req.admin.adminId })
    await category.save()
    res.status(201).json({ msg: "Category added successfully", category })
  } catch (err) {
    res.status(500).json({ msg: "Category add failed", error: err.message })
  }
}

// ─────────────────────────────────────────────
// VIEW CATEGORIES
// GET /adminapi/category
// ─────────────────────────────────────────────
exports.viewCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find()
    res.json({ status: 0, msg: "Category list fetched successfully", data: categories })
  } catch (err) {
    res.status(500).json({ status: 1, msg: "Failed to fetch categories", err })
  }
}

// ─────────────────────────────────────────────
// EDIT CATEGORY
// POST /adminapi/category/:id
// ─────────────────────────────────────────────
exports.editCategory = async (req, res) => {
  try {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, status: req.body.status },
      { returnDocument: "after" }
    )
    if (!updatedCategory) return res.status(404).json({ status: 1, msg: "Category not found" })
    res.status(200).json({ status: 0, msg: "Category updated successfully", data: updatedCategory })
  } catch (err) {
    res.status(500).json({ status: 2, msg: "Category update failed", error: err.message })
  }
}

// ─────────────────────────────────────────────
// DELETE CATEGORY
// GET /adminapi/category/:id
// ─────────────────────────────────────────────
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await CategoryModel.findByIdAndDelete(req.params.id)
    if (!deletedCategory) return res.status(404).json({ status: 1, msg: "Category not found" })
    res.status(200).json({ status: 0, msg: "Category deleted successfully" })
  } catch (err) {
    res.status(500).json({ status: 2, msg: "Category delete failed", error: err.message })
  }
}

// ─────────────────────────────────────────────
// TOGGLE VENDOR STATUS
// POST /adminapi/toggleVendor  body: { id }
// ─────────────────────────────────────────────
exports.toggleVendor = async (req, res) => {
  try {
    const vendor = await VendorModel.findById(req.body.id)
    if (!vendor) return res.status(404).json({ msg: "Vendor not found" })
    const newStatus = vendor.status === "enable" ? "disable" : "enable"
    await VendorModel.findByIdAndUpdate(req.body.id, { status: newStatus }, { returnDocument: "after" })
    res.json({ msg: `Vendor ${newStatus}d successfully`, status: newStatus })
  } catch (err) {
    res.status(500).json({ msg: "Toggle failed", error: err.message })
  }
}

// ─────────────────────────────────────────────
// TOGGLE USER STATUS
// POST /adminapi/toggleUser  body: { id }
// ─────────────────────────────────────────────
exports.toggleUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.id)
    if (!user) return res.status(404).json({ msg: "User not found" })
    const newStatus = user.status === "enable" ? "disable" : "enable"
    await UserModel.findByIdAndUpdate(req.body.id, { status: newStatus }, { returnDocument: "after" })
    res.json({ msg: `User ${newStatus}d successfully`, status: newStatus })
  } catch (err) {
    res.status(500).json({ msg: "Toggle failed", error: err.message })
  }
}

// ─────────────────────────────────────────────
// TOGGLE TEMPLATE ENABLE / DISABLE
// PATCH /adminapi/template-toggle/:id
// ─────────────────────────────────────────────
exports.toggleTemplateEnable = async (req, res) => {
  try {
    const { isEnabled } = req.body
    const template = await Template.findByIdAndUpdate(
      req.params.id,
      {
        isEnabled:    isEnabled,
        designStatus: isEnabled ? "approved" : "disabled"
      },
      { returnDocument: "after" }
    )
    if (!template) return res.status(404).json({ message: "Template not found" })
    res.json({ success: true, isEnabled: template.isEnabled, designStatus: template.designStatus })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// ─────────────────────────────────────────────
// UPDATE ADMIN
// POST /adminapi/update/:id
// ─────────────────────────────────────────────
exports.updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await AdminModel.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, email: req.body.email, mobile: req.body.mobile },
      { returnDocument: "after" }
    )
    res.json({ msg: "Admin updated successfully", updatedAdmin })
  } catch (err) {
    res.json({ msg: "Admin update failed", err })
  }
}

// ─────────────────────────────────────────────
// VIEW SINGLE VENDOR
// GET /adminapi/vendor/:id
// ─────────────────────────────────────────────
exports.viewSingleVendor = async (req, res) => {
  try {
    const Vendor = await VendorModel.findById(req.params.id).select("-password")
    if (!Vendor) return res.status(404).json({ message: "Vendor not found" })
    res.status(200).json({ message: "Vendor fetched successfully", Vendor })
  } catch (error) {
    res.status(500).json({ message: "Error fetching vendor", error: error.message })
  }
}

// ─────────────────────────────────────────────
// GET ALL TEMPLATES
// GET /adminapi/all-templates
// ─────────────────────────────────────────────
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find().populate("vendorId", "name email")
    res.status(200).json(templates)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────
// CHANGE TEMPLATE STATUS + COMMENT
// POST /adminapi/template-status/:id
// ─────────────────────────────────────────────
exports.changeTemplateStatus = async (req, res) => {
  try {
    const { status, comment } = req.body
    const template = await Template.findByIdAndUpdate(
      req.params.id,
      { designStatus: status, adminComment: comment },
      { returnDocument: "after" }
    )
    if (!template) return res.status(404).json({ message: "Template not found" })
    res.status(200).json({ message: "Template status updated", template })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────
// GET ADMIN PROFILE
// GET /adminapi/me
// ─────────────────────────────────────────────
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await AdminModel.findById(req.admin.adminId).select("-password")
    if (!admin) return res.status(404).json({ message: "Admin not found" })
    res.json({ admin })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// ─────────────────────────────────────────────
// CHANGE PASSWORD
// POST /adminapi/change-password/:id
// ─────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const admin = await AdminModel.findById(req.params.id)
    if (!admin) return res.status(404).json({ message: "Admin not found" })

    const isMatch = await bcrypt.compare(currentPassword, admin.password)
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" })

    const hashed = await bcrypt.hash(newPassword, 12)
    await AdminModel.findByIdAndUpdate(req.params.id, { password: hashed })
    res.json({ success: true, message: "Password changed successfully" })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}


exports.getAllOrders = async (req, res) => {
  try {
    const Order = require("../../model/Order")

    // ✅ require all models that populate needs — guarantees they are registered
    require("../../model/User")
    require("../../model/Vendor")
    require("../../model/Template")
    require("../../model/Category")

    const orders = await Order.find()
      .populate("userId", "name email")
      .populate({
        path:   "items.templateId",
        select: "designName designThumbnail regularPrice vendorId designCategory",
        populate: [
          { path: "vendorId",       select: "name email" },
          { path: "designCategory", select: "name" },
        ]
      })
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (err) {
    console.log("getAllOrders ERROR:", err.message)
    res.status(500).json({ message: err.message })
  }
}


// controller/admin/adminController.js
// Replace ONLY getAllTemplates function

exports.getAllTemplates = async (req, res) => {
  try {
    require("../../model/Vendor")
    require("../../model/Category")

    const templates = await Template.find()
      .populate("vendorId",       "name email")
      .populate("designCategory", "name")   // ✅ populate category name
      .sort({ createdAt: -1 })

    res.status(200).json(templates)
  } catch (error) {
    console.log("getAllTemplates ERROR:", error.message)
    res.status(500).json({ message: error.message })
  }
}







// ─────────────────────────────────────────────
// FORGOT PASSWORD — generate token, log to console
// POST /adminapi/forgot-password
// ─────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: "Email is required" })

    const admin = await AdminModel.findOne({ email: email.toLowerCase().trim() })
    if (!admin) return res.status(404).json({ message: "No admin account found with this email" })

    const token     = crypto.randomBytes(32).toString("hex")
    const expiresAt = Date.now() + 30 * 60 * 1000  // 30 minutes

    admin.resetPasswordToken   = token
    admin.resetPasswordExpires = expiresAt
    await admin.save()

    // ✅ Log to console only — not sent to frontend
    console.log("🔗 Admin Password Reset URL:", `http://localhost:5173/admin/reset-password/${token}`)

    res.json({ success: true, message: "Password reset link has been sent to your email." })
  } catch (err) {
    console.log("forgotPassword error:", err)
    res.status(500).json({ message: err.message })
  }
}

// ─────────────────────────────────────────────
// RESET PASSWORD — verify token, save new password
// POST /adminapi/reset-password/:token
// ─────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { token }       = req.params
    const { newPassword } = req.body

    if (!token)       return res.status(400).json({ message: "Token is required" })
    if (!newPassword) return res.status(400).json({ message: "New password is required" })
    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" })

    const admin = await AdminModel.findOne({
      resetPasswordToken:   token,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!admin) {
      return res.status(400).json({ message: "Reset link is invalid or has expired. Please request a new one." })
    }

    const hashed = await bcrypt.hash(newPassword, 12)
    admin.password             = hashed
    admin.resetPasswordToken   = undefined
    admin.resetPasswordExpires = undefined
    await admin.save()

    res.json({ success: true, message: "Password reset successful. You can now log in." })
  } catch (err) {
    console.log("resetPassword error:", err)
    res.status(500).json({ message: err.message })
  }
}

