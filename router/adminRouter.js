// const express = require("express");
// const router = express.Router();

// const adminController = require("../controller/admin/adminController");
// const adminAuth = require("../controller/middleware/adminAuth");

// // http://localhost:5000/adminapi/login
// router.post("/login", adminController.login);

// // http://localhost:5000/adminapi/register
// router.post("/register", adminController.register);

// // http://localhost:5000/adminapi/vendors
// router.get("/vendors", adminAuth, adminController.viewVendors);

// // http://localhost:5000/adminapi/users
// router.get("/users", adminAuth, adminController.viewUsers);

// // http://localhost:5000/adminapi/category
// router.post("/category", adminAuth, adminController.addCategory);

// // http://localhost:5000/adminapi/category
// router.get("/category", adminAuth, adminController.viewCategories);

// // http://localhost:5000/adminapi/category/:id
// router.post("/category/:id", adminAuth, adminController.editCategory);

// // http://localhost:5000/adminapi/category/:id
// router.get("/category/:id", adminAuth, adminController.deleteCategory);

// // ✅ NEW — toggle vendor enable/disable (replaces verifyVendor)
// // http://localhost:5000/adminapi/toggleVendor
// router.post("/toggleVendor", adminAuth, adminController.toggleVendor)

// // ✅ NEW — toggle user enable/disable (replaces verifyUser)
// // http://localhost:5000/adminapi/toggleUser
// router.post("/toggleUser", adminAuth, adminController.toggleUser)

// // ✅ NEW — toggle template enable/disable
// // http://localhost:5000/adminapi/template-toggle/:id
// router.patch("/template-toggle/:id", adminAuth, adminController.toggleTemplateEnable);

// // http://localhost:5000/adminapi/verifyVendor
// // router.post("/verifyVendor", adminAuth,adminController.verifyVendor);

// // http://localhost:5000/adminapi/verifyUser
// // router.get("/verifyUser",adminAuth,adminController.verifyUser)

// // http://localhost:5000/adminapi/update/:id
// router.post("/update/:id", adminAuth, adminController.updateAdmin);

// // http://localhost:5000/adminapi/vendor/:id
// router.get("/vendor/:id", adminAuth, adminController.viewSingleVendor);

// // http://localhost:5000/adminapi/all-templates
// router.get("/all-templates", adminAuth, adminController.getAllTemplates);

// // http://localhost:5000/adminapi/template-status/TEMPLATE_ID
// router.post("/template-status/:id", adminAuth, adminController.changeTemplateStatus);

// //http://localhost:5000/adminapi/change-password/adminId
// router.post("/change-password/:id", adminAuth, adminController.changePassword)

// // http://localhost:5000/adminapi/me
// router.get("/me", adminAuth, adminController.getAdminProfile)

// module.exports = router;



// const express = require("express")
// const router  = express.Router()

// const adminController = require("../controller/admin/adminController")
// const adminPaymentController = require("../controller/admin/adminPaymentController")
// const adminAuth       = require("../controller/middleware/adminAuth")

// // POST /adminapi/login
// router.post("/login", adminController.login)

// // POST /adminapi/register
// router.post("/register", adminController.register)

// // GET /adminapi/vendors
// router.get("/vendors", adminAuth, adminController.viewVendors)

// // GET /adminapi/users
// router.get("/users", adminAuth, adminController.viewUsers)

// // POST /adminapi/category
// router.post("/category", adminAuth, adminController.addCategory)

// // GET /adminapi/category
// router.get("/category", adminAuth, adminController.viewCategories)

// // POST /adminapi/category/:id  (edit)
// router.post("/category/:id", adminAuth, adminController.editCategory)

// // GET /adminapi/category/:id  (delete)
// router.get("/category/:id", adminAuth, adminController.deleteCategory)

// // POST /adminapi/toggleVendor
// router.post("/toggleVendor", adminAuth, adminController.toggleVendor)

// // POST /adminapi/toggleUser
// router.post("/toggleUser", adminAuth, adminController.toggleUser)

// // PATCH /adminapi/template-toggle/:id
// router.patch("/template-toggle/:id", adminAuth, adminController.toggleTemplateEnable)

// // POST /adminapi/update/:id
// router.post("/update/:id", adminAuth, adminController.updateAdmin)

// // GET /adminapi/vendor/:id
// router.get("/vendor/:id", adminAuth, adminController.viewSingleVendor)

// // GET /adminapi/all-templates
// router.get("/all-templates", adminAuth, adminController.getAllTemplates)

// // POST /adminapi/template-status/:id
// router.post("/template-status/:id", adminAuth, adminController.changeTemplateStatus)

// // POST /adminapi/change-password/:id
// router.post("/change-password/:id", adminAuth, adminController.changePassword)

// // GET /adminapi/me
// router.get("/me", adminAuth, adminController.getAdminProfile)

// // GET all payments
// router.get("/payments", adminAuth, adminPaymentController.getAllPayments)

// // Send receipt to vendor (with file upload)
// router.post(
//   "/payments/:id/send-receipt",
//   adminAuth,
//   adminPaymentController.uploadReceipt,
//   adminPaymentController.sendReceipt
// )

// router.put(
//   "/payments/:id/status",
//   adminAuth,
//   adminPaymentController.updatePaymentStatus
// )

// module.exports = router




// adminRouter.js
const express = require("express")
const router  = express.Router()

const adminController        = require("../controller/admin/adminController")
const adminPaymentController = require("../controller/admin/adminPaymentController")
const adminAuth              = require("../controller/middleware/adminAuth")

router.post("/login",    adminController.login)
router.post("/register", adminController.register)

router.get("/vendors",  adminAuth, adminController.viewVendors)
router.get("/users",    adminAuth, adminController.viewUsers)

router.post("/category",     adminAuth, adminController.addCategory)
router.get("/category",      adminAuth, adminController.viewCategories)
router.post("/category/:id", adminAuth, adminController.editCategory)
router.get("/category/:id",  adminAuth, adminController.deleteCategory)

router.post("/toggleVendor", adminAuth, adminController.toggleVendor)
router.post("/toggleUser",   adminAuth, adminController.toggleUser)

router.patch("/template-toggle/:id",  adminAuth, adminController.toggleTemplateEnable)
router.post("/update/:id",            adminAuth, adminController.updateAdmin)
router.get("/vendor/:id",             adminAuth, adminController.viewSingleVendor)
router.get("/all-templates",          adminAuth, adminController.getAllTemplates)
router.post("/template-status/:id",   adminAuth, adminController.changeTemplateStatus)
router.post("/change-password/:id",   adminAuth, adminController.changePassword)
router.get("/me",                     adminAuth, adminController.getAdminProfile)
router.get("/all-orders",             adminAuth, adminController.getAllOrders)

// ── Payment routes ──────────────────────────────────────────────────────────
// GET all payments
router.get("/payments", adminAuth, adminPaymentController.getAllPayments)

// POST send receipt with file upload to vendor
router.post(
  "/payments/:id/send-receipt",
  adminAuth,
  adminPaymentController.uploadReceipt,   // multer middleware first
  adminPaymentController.sendReceipt      // then controller
)

// PUT mark as paid (no file)
router.put("/payments/:id/status", adminAuth, adminPaymentController.updatePaymentStatus)

// ── In adminRoutes.js ──
const {
  getAdminPayments,
  sendReceiptToVendor
} = require("../controller/payment/paymentController")
const multer = require("multer")
const upload = multer({ dest: "uploads/receipts/" })

router.get("/payments", adminAuth, getAdminPayments)
router.post("/payments/:id/send-receipt", adminAuth, upload.single("receipt"), sendReceiptToVendor)


router.post("/payments/fix-receipts", adminAuth, adminPaymentController.fixMissingReceipts)  // ✅ add this


// ── In adminRouter.js ── add these:
const adminFeedbackController = require("../controller/admin/adminFeedbackController")

router.get("/feedback", adminAuth, adminFeedbackController.getAllFeedback)
router.get("/feedback/:templateId", adminAuth, adminFeedbackController.getFeedbackByTemplate)
router.put("/feedback/:id/toggle-visibility", adminAuth, adminFeedbackController.toggleReviewVisibility)
router.put("/feedback/:id/resolve-complaint", adminAuth, adminFeedbackController.resolveComplaint)
router.put("/feedback/template/:templateId/toggle", adminAuth, adminFeedbackController.toggleTemplateStatus)
router.delete("/feedback/:id", adminAuth, adminFeedbackController.deleteReview)

router.post("/forgot-password", adminController.forgotPassword)
router.post("/reset-password/:token", adminController.resetPassword)

module.exports = router


