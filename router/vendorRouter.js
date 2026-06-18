// const express = require("express");
// const router = express.Router();

// const vendorController = require("../controller/vendor/vendorController");
// const vendorAuth = require("../controller/middleware/vendorAuth")

// const templateController = require("../controller/vendor/templateController");
// const upload = require("../controller/middleware/upload")
// const vendorCartController = require("../controller/vendor/vendorCartController")
// const vendorPaymentController = require("../controller/vendor/vendorPaymentController")


// // http://localhost:5000/vendorapi/register
// router.post("/register", vendorController.register);

// // http://localhost:5000/vendorapi/login
// router.post("/login", vendorController.login);

// // http://localhost:5000/vendorapi/update/:id
// router.put("/update/:id", vendorAuth, vendorController.updateVendor);

// // http://localhost:5000/vendorapi/category
// router.get("/category", vendorAuth, vendorController.viewCategory);

// // http://localhost:5000/vendorapi/upload-template
// // router.post("/upload-template", vendorAuth,upload.single("designThumbnail"), templateController.uploadTemplate);

// // http://localhost:5000/vendorapi/upload-template
// router.post("/upload-template",vendorAuth,upload.fields([
//     { name: "designThumbnail", maxCount: 1 },
//     { name: "designPackage", maxCount: 1 },
//     { name: "previewImages", maxCount: 10 }]),templateController.uploadTemplate);

// // http://localhost:5000/vendorapi/my-templates
// router.get("/my-templates", vendorAuth, templateController.myTemplates);

// // http://localhost:5000/vendorapi/template/TEMPLATE_ID
// router.get("/template/:id", vendorAuth, templateController.viewSingleTemplate);

// // http://localhost:5000/vendorapi/cart-products
// router.get("/cart-products",vendorAuth,vendorCartController.viewVendorCartProducts);

// // // http://localhost:5000/vendorapi/edit-template/TEMPLATE_ID
// // router.post("/edit-template/:id",vendorAuth,templateController.editTemplate);

// // http://localhost:5000/vendorapi/edit-template/TEMPLATE_ID
// router.post("/edit-template/:id", vendorAuth, upload.fields([
//   { name: "designThumbnail", maxCount: 1 },
//   { name: "designPackage",   maxCount: 1 },
//   { name: "previewImages",   maxCount: 10 }
// ]), templateController.editTemplate);

// // http://localhost:5000/vendorapi/delete-template/TEMPLATE_ID
// router.post("/delete-template/:id",vendorAuth,templateController.deleteTemplate);

// // GET  http://localhost:5000/vendorapi/bank-details
// router.get("/bank-details",  vendorAuth, vendorController.getBankDetails)

// // POST http://localhost:5000/vendorapi/bank-details
// router.post("/bank-details", vendorAuth, vendorController.saveBankDetails)

// // POST http://localhost:5000/vendorapi/toggle-template/:id    
// router.post("/toggle-template/:id", vendorAuth, templateController.toggleTemplate)

// // GET /vendorapi/my-orders  ✅ NEW
// router.get("/my-orders", vendorAuth, vendorController.getMyOrders)

// router.get("/my-payments", vendorAuth, vendorPaymentController.getMyPayments)

// // ✅ ADD THIS ROUTE
// router.get("/payments", vendorAuth, vendorPaymentController.getVendorPayments)

// // // ✅ UPDATE payment status (FIX 404 issue)
// // router.put(
// //   "/payments/:id/status",
// //   adminAuth,
// //   adminPaymentController.updatePaymentStatus
// // )

// // // ✅ SEND receipt (already present but keep it correct)
// // router.post(
// //   "/payments/:id/send-receipt",
// //   adminAuth,
// //   adminPaymentController.uploadReceipt,
// //   adminPaymentController.sendReceipt
// // )

// module.exports = router;




// const express = require("express")
// const router  = express.Router()

// const vendorController        = require("../controller/vendor/vendorController")
// const vendorAuth              = require("../controller/middleware/vendorAuth")
// const templateController      = require("../controller/vendor/templateController")
// const upload                  = require("../controller/middleware/upload")
// const vendorCartController    = require("../controller/vendor/vendorCartController")
// const vendorPaymentController = require("../controller/vendor/vendorPaymentController")

// router.post("/register", vendorController.register)
// router.post("/login",    vendorController.login)

// router.put("/update/:id", vendorAuth, vendorController.updateVendor)
// router.get("/category",   vendorAuth, vendorController.viewCategory)

// router.post("/upload-template", vendorAuth, upload.fields([
//   { name: "designThumbnail", maxCount: 1  },
//   { name: "designPackage",   maxCount: 1  },
//   { name: "previewImages",   maxCount: 10 }
// ]), templateController.uploadTemplate)

// router.get("/my-templates",       vendorAuth, templateController.myTemplates)
// router.get("/template/:id",       vendorAuth, templateController.viewSingleTemplate)
// router.get("/cart-products",      vendorAuth, vendorCartController.viewVendorCartProducts)

// router.post("/edit-template/:id", vendorAuth, upload.fields([
//   { name: "designThumbnail", maxCount: 1  },
//   { name: "designPackage",   maxCount: 1  },
//   { name: "previewImages",   maxCount: 10 }
// ]), templateController.editTemplate)

// router.post("/delete-template/:id", vendorAuth, templateController.deleteTemplate)
// router.post("/toggle-template/:id", vendorAuth, templateController.toggleTemplate)

// router.get("/bank-details",         vendorAuth, vendorController.getBankDetails)
// router.post("/bank-details",        vendorAuth, vendorController.saveBankDetails)

// router.get("/me",                         vendorAuth, vendorController.getVendorProfile)
// router.post("/change-password/:id",       vendorAuth, vendorController.changePassword)
// router.get("/my-orders",                  vendorAuth, vendorController.getMyOrders)

// // ✅ Both routes now work — both functions exist in vendorPaymentController
// router.get("/my-payments", vendorAuth, vendorPaymentController.getMyPayments)
// router.get("/payments",    vendorAuth, vendorPaymentController.getVendorPayments)

// // ── In vendorRoutes.js ──
// const { getVendorPayments } = require("../controller/payment/paymentController")
// router.get("/my-payments", vendorAuth, getVendorPayments)




// // ── In vendorRouter.js ── add these:
// const vendorFeedbackController = require("../controller/vendor/vendorFeedbackController")

// router.get("/feedback", vendorAuth, vendorFeedbackController.getMyTemplateFeedback)
// router.get("/feedback/:templateId", vendorAuth, vendorFeedbackController.getTemplateFeedback)
// module.exports = router



// const express = require("express")
// const router  = express.Router()

// const vendorController         = require("../controller/vendor/vendorController")
// const vendorAuth               = require("../controller/middleware/vendorAuth")
// const templateController       = require("../controller/vendor/templateController")
// const upload                   = require("../controller/middleware/upload")
// const vendorCartController     = require("../controller/vendor/vendorCartController")
// const vendorPaymentController  = require("../controller/vendor/vendorPaymentController")
// const vendorFeedbackController = require("../controller/vendor/vendorFeedbackController")

// // ── Auth ──
// router.post("/register", vendorController.register)
// router.post("/login",    vendorController.login)

// // ✅ Forgot / Reset password — no auth required
// router.post("/forgot-password",           vendorController.forgotPassword)
// router.post("/reset-password/:token",     vendorController.resetPassword)

// // ── Profile ──
// router.put("/update/:id",           vendorAuth, vendorController.updateVendor)
// router.get("/me",                   vendorAuth, vendorController.getVendorProfile)
// router.post("/change-password/:id", vendorAuth, vendorController.changePassword)

// // ── Category ──
// router.get("/category", vendorAuth, vendorController.viewCategory)

// // ── Templates ──
// router.post("/upload-template", vendorAuth, upload.fields([
//   { name: "designThumbnail", maxCount: 1  },
//   { name: "designPackage",   maxCount: 1  },
//   { name: "previewImages",   maxCount: 10 }
// ]), templateController.uploadTemplate)

// router.get("/my-templates",   vendorAuth, templateController.myTemplates)
// router.get("/template/:id",   vendorAuth, templateController.viewSingleTemplate)

// router.post("/edit-template/:id", vendorAuth, upload.fields([
//   { name: "designThumbnail", maxCount: 1  },
//   { name: "designPackage",   maxCount: 1  },
//   { name: "previewImages",   maxCount: 10 }
// ]), templateController.editTemplate)

// router.post("/delete-template/:id", vendorAuth, templateController.deleteTemplate)
// router.post("/toggle-template/:id", vendorAuth, templateController.toggleTemplate)

// // ── Cart ──
// router.get("/cart-products", vendorAuth, vendorCartController.viewVendorCartProducts)

// // ── Bank Details ──
// router.get("/bank-details",  vendorAuth, vendorController.getBankDetails)
// router.post("/bank-details", vendorAuth, vendorController.saveBankDetails)

// // ── Orders ──
// router.get("/my-orders", vendorAuth, vendorController.getMyOrders)

// // ── Payments ──
// router.get("/payments", vendorAuth, vendorPaymentController.getVendorPayments)

// // ── Feedback ──
// router.get("/feedback",             vendorAuth, vendorFeedbackController.getMyTemplateFeedback)
// router.get("/feedback/:templateId", vendorAuth, vendorFeedbackController.getTemplateFeedback)

// module.exports = router




const express = require("express")
const router  = express.Router()

const vendorController         = require("../controller/vendor/vendorController")
const vendorAuth               = require("../controller/middleware/vendorAuth")
const templateController       = require("../controller/vendor/templateController")
const upload                   = require("../controller/middleware/upload")
const vendorCartController     = require("../controller/vendor/vendorCartController")
const vendorPaymentController  = require("../controller/vendor/vendorPaymentController")
const vendorFeedbackController = require("../controller/vendor/vendorFeedbackController")

// ── Auth ──
router.post("/register", vendorController.register)
router.post("/login",    vendorController.login)

// ── Forgot / Reset password ──
router.post("/forgot-password",       vendorController.forgotPassword)
router.post("/reset-password/:token", vendorController.resetPassword)

// ── Profile ──
router.put("/update/:id",           vendorAuth, vendorController.updateVendor)
router.get("/me",                   vendorAuth, vendorController.getVendorProfile)
router.post("/change-password/:id", vendorAuth, vendorController.changePassword)

// ── Category ──
router.get("/category", vendorAuth, vendorController.viewCategory)

// ── Templates ──
router.post("/upload-template", vendorAuth, upload.fields([
  { name: "designThumbnail", maxCount: 1  },
  { name: "designPackage",   maxCount: 1  },
  { name: "previewImages",   maxCount: 10 }
]), templateController.uploadTemplate)

router.get("/my-templates",   vendorAuth, templateController.myTemplates)
router.get("/template/:id",   vendorAuth, templateController.viewSingleTemplate)

router.post("/edit-template/:id", vendorAuth, upload.fields([
  { name: "designThumbnail", maxCount: 1  },
  { name: "designPackage",   maxCount: 1  },
  { name: "previewImages",   maxCount: 10 }
]), templateController.editTemplate)

router.post("/delete-template/:id", vendorAuth, templateController.deleteTemplate)
router.post("/toggle-template/:id", vendorAuth, templateController.toggleTemplate)

// ── Cart ──
router.get("/cart-products", vendorAuth, vendorCartController.viewVendorCartProducts)

// ── Bank Details ──
router.get("/bank-details",  vendorAuth, vendorController.getBankDetails)
router.post("/bank-details", vendorAuth, vendorController.saveBankDetails)

// ── Orders ──
router.get("/my-orders", vendorAuth, vendorController.getMyOrders)

// ✅ Payments — single clean route, no duplicates
router.get("/my-payments", vendorAuth, vendorPaymentController.getMyPayments)
router.get("/payments",    vendorAuth, vendorPaymentController.getVendorPayments)

// ── Feedback ──
router.get("/feedback",             vendorAuth, vendorFeedbackController.getMyTemplateFeedback)
router.get("/feedback/:templateId", vendorAuth, vendorFeedbackController.getTemplateFeedback)

module.exports = router