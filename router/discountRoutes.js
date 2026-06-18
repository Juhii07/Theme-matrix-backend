const express = require("express");
const router  = express.Router();
const discountController = require("../controller/admin/discountController");
const adminAuth = require("../controller/middleware/adminAuth");
const userAuth  = require("../controller/middleware/userAuth");

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────
// POST   http://localhost:5000/api/admin/discounts              → Create discount
router.post("/admin/discounts",adminAuth, discountController.createDiscount);

// GET    http://localhost:5000/api/admin/discounts              → Get all discounts
router.get("/admin/discounts",adminAuth, discountController.getAllDiscounts);

// PATCH  http://localhost:5000/api/admin/discounts/:id/toggle   → Toggle active/inactive
router.patch("/admin/discounts/:id/toggle",adminAuth, discountController.toggleDiscount);

// DELETE http://localhost:5000/api/admin/discounts/:id          → Delete discount
router.delete("/admin/discounts/:id",adminAuth, discountController.deleteDiscount);

// ─── USER ROUTES ──────────────────────────────────────────────────────
// GET    http://localhost:5000/api/user/active-discount         → Auto get best active discount
router.get("/user/active-discount",  userAuth, discountController.getActiveDiscount);

// POST   http://localhost:5000/api/user/discount/apply          → Apply discount (increment usedCount)
router.post("/user/discount/apply",  userAuth, discountController.applyDiscount);

module.exports = router;