// require("dotenv").config()
// const express = require("express");
// const router = express.Router();

// const userController = require("../controller/user/userController");
// // const { getOrders } = require("../controller/order/orderController");

// const userAuth = require("../controller/middleware/userAuth");
// const userTemplateController = require("../controller/user/userTemplateController")

// //http://localhost:5000/userapi/register
// router.post("/register",userController.register);

// //http://localhost:5000/userapi/login
// router.post("/login",userController.loginUser);

// // http://localhost:5000/orderapi/orders
// // router.get("/orders", userAuth, getOrders);

// // http://localhost:5000/userapi/update/:id
// router.put("/update/:id", userAuth, userController.updateUser);

// // http://localhost:5000/userapi/templates
// router.get("/templates", userController.findAllTemplates);

// // http://localhost:5000/userapi/templates/category/:categoryID
// router.get("/templates/category/:categoryId", userController.findTemplatesByCategory);

// // http://localhost:5000/userapi/templates/latest
// router.get("/templates/latest", userController.findLatestTemplates);

// // http://localhost:5000/userapi/template/TEMPLATE_ID
// router.get("/template/:id",userTemplateController.displaySingleTemplate);

// // http://localhost:5000/userapi/add-to-cart
// router.post("/add-to-cart",userAuth,userTemplateController.addToCart);

// // http://localhost:5000/userapi/view-cart
// router.get("/view-cart",userAuth,userTemplateController.viewCart);

// // DELETE http://localhost:5000/userapi/remove-cart/:id
// router.delete("/remove-cart/:id", userAuth, userTemplateController.removeFromCart)

// module.exports = router;





// require("dotenv").config();
// const express  = require("express");
// const router   = express.Router();

// const userController         = require("../controller/user/userController");
// const userTemplateController = require("../controller/user/userTemplateController");
// const userAuth               = require("../controller/middleware/userAuth");

// // ─── AUTH ─────────────────────────────────────────────────────
// // POST http://localhost:5000/userapi/register
// router.post("/register", userController.register);

// // POST http://localhost:5000/userapi/login
// router.post("/login", userController.loginUser);

// // PUT http://localhost:5000/userapi/update/:id
// router.put("/update/:id", userAuth, userController.updateUser);

// // ─── TEMPLATES ────────────────────────────────────────────────
// // GET http://localhost:5000/userapi/templates
// router.get("/templates", userController.findAllTemplates);

// // GET http://localhost:5000/userapi/templates/latest
// router.get("/templates/latest", userController.findLatestTemplates);

// // GET http://localhost:5000/userapi/templates/category/:categoryId
// router.get("/templates/category/:categoryId", userController.findTemplatesByCategory);

// // GET http://localhost:5000/userapi/template/:id
// router.get("/template/:id", userTemplateController.displaySingleTemplate);

// // ─── CART ─────────────────────────────────────────────────────
// // POST http://localhost:5000/userapi/add-to-cart
// router.post("/add-to-cart", userAuth, userTemplateController.addToCart);

// // GET http://localhost:5000/userapi/view-cart
// router.get("/view-cart", userAuth, userTemplateController.viewCart);

// // DELETE http://localhost:5000/userapi/remove-cart/:id
// router.delete("/remove-cart/:id", userAuth, userTemplateController.removeFromCart);

// // ─── RATINGS ──────────────────────────────────────────────────
// // GET http://localhost:5000/userapi/ratings/:templateId
// router.get("/ratings/:templateId", userController.getRatings);

// // POST http://localhost:5000/userapi/rate/:templateId
// router.post("/rate/:templateId", userAuth, userController.submitRating);

// module.exports = router;



// require("dotenv").config();
// const express  = require("express");
// const router   = express.Router();

// const userController         = require("../controller/user/userController");
// const userTemplateController = require("../controller/user/userTemplateController");
// const userAuth               = require("../controller/middleware/userAuth");

// // ─── AUTH ──────────────────────────────────────────────────────────────
// // POST http://localhost:5000/userapi/register
// router.post("/register", userController.register);

// // POST http://localhost:5000/userapi/login
// router.post("/login", userController.loginUser);

// // ─── PROFILE ───────────────────────────────────────────────────────────
// // PUT http://localhost:5000/userapi/update/:id
// router.put("/update/:id", userAuth, userController.updateUser);

// // ─── TEMPLATES ─────────────────────────────────────────────────────────
// // GET http://localhost:5000/userapi/templates
// router.get("/templates", userController.findAllTemplates);

// // GET http://localhost:5000/userapi/templates/latest
// router.get("/templates/latest", userController.findLatestTemplates);

// // GET http://localhost:5000/userapi/templates/category/:categoryId
// router.get("/templates/category/:categoryId", userController.findTemplatesByCategory);

// // GET http://localhost:5000/userapi/template/:id
// router.get("/template/:id", userTemplateController.displaySingleTemplate);

// // ─── CART ──────────────────────────────────────────────────────────────
// // POST http://localhost:5000/userapi/add-to-cart
// router.post("/add-to-cart", userAuth, userTemplateController.addToCart);

// // GET http://localhost:5000/userapi/view-cart
// router.get("/view-cart", userAuth, userTemplateController.viewCart);

// // DELETE http://localhost:5000/userapi/remove-cart/:id
// router.delete("/remove-cart/:id", userAuth, userTemplateController.removeFromCart);

// // ─── RATINGS ───────────────────────────────────────────────────────────
// // GET http://localhost:5000/userapi/ratings/:templateId
// router.get("/ratings/:templateId", userController.getRatings);

// // POST http://localhost:5000/userapi/rate/:templateId
// router.post("/rate/:templateId", userAuth, userController.submitRating);

// module.exports = router;




// require("dotenv").config();
// const express  = require("express");
// const router   = express.Router();

// const userController         = require("../controller/user/userController");
// const userTemplateController = require("../controller/user/userTemplateController");
// const userAuth               = require("../controller/middleware/userAuth");

// // ─── AUTH ──────────────────────────────────────────────────────
// // POST http://localhost:5000/userapi/register
// router.post("/register", userController.register);

// // POST http://localhost:5000/userapi/login
// router.post("/login", userController.loginUser);

// // PUT http://localhost:5000/userapi/update/:id
// router.put("/update/:id", userAuth, userController.updateUser);

// // ─── TEMPLATES ─────────────────────────────────────────────────
// // GET http://localhost:5000/userapi/templates
// router.get("/templates", userController.findAllTemplates);

// // GET http://localhost:5000/userapi/templates/latest
// router.get("/templates/latest", userController.findLatestTemplates);

// // GET http://localhost:5000/userapi/templates/category/:categoryId
// router.get("/templates/category/:categoryId", userController.findTemplatesByCategory);

// // GET http://localhost:5000/userapi/template/:id
// router.get("/template/:id", userTemplateController.displaySingleTemplate);

// // ─── CART ──────────────────────────────────────────────────────
// // POST http://localhost:5000/userapi/add-to-cart
// router.post("/add-to-cart", userAuth, userTemplateController.addToCart);

// // GET http://localhost:5000/userapi/view-cart
// router.get("/view-cart", userAuth, userTemplateController.viewCart);

// // DELETE http://localhost:5000/userapi/remove-cart/:id
// router.delete("/remove-cart/:id", userAuth, userTemplateController.removeFromCart);

// // ─── RATINGS ───────────────────────────────────────────────────
// // GET http://localhost:5000/userapi/ratings/:templateId
// router.get("/ratings/:templateId", userController.getRatings);

// // POST http://localhost:5000/userapi/rate/:templateId
// router.post("/rate/:templateId", userAuth, userController.submitRating);

// // ─── PURCHASE CHECK & DOWNLOAD ─────────────────────────────────
// // GET http://localhost:5000/userapi/check-purchase/:templateId
// router.get("/check-purchase/:templateId", userAuth, userTemplateController.checkPurchase);

// // GET http://localhost:5000/userapi/download/:templateId
// router.get("/download/:templateId", userAuth, userTemplateController.downloadTemplate);

// // GET http://localhost:5000/userapi/my-receipts
// router.get("/my-receipts", userAuth, getUserReceipts)

// module.exports = router;





// // userRouter.js
// require("dotenv").config()
// const express = require("express")
// const router  = express.Router()

// const userController         = require("../controller/user/userController")
// const userTemplateController = require("../controller/user/userTemplateController")
// const userAuth               = require("../controller/middleware/userAuth")

// // ✅ FIXED — import getUserReceipts from paymentController
// const { getUserReceipts } = require("../controller/payment/paymentController")

// // ─── AUTH ───────────────────────────────────────────────────────
// router.post("/register",      userController.register)
// router.post("/login",         userController.loginUser)
// router.put("/update/:id",     userAuth, userController.updateUser)

// // ─── TEMPLATES ──────────────────────────────────────────────────
// router.get("/templates",                        userController.findAllTemplates)
// router.get("/templates/latest",                 userController.findLatestTemplates)
// router.get("/templates/category/:categoryId",   userController.findTemplatesByCategory)
// router.get("/template/:id",                     userTemplateController.displaySingleTemplate)

// // ─── CART ────────────────────────────────────────────────────────
// router.post("/add-to-cart",       userAuth, userTemplateController.addToCart)
// router.get("/view-cart",          userAuth, userTemplateController.viewCart)
// router.delete("/remove-cart/:id", userAuth, userTemplateController.removeFromCart)

// // ─── RATINGS ─────────────────────────────────────────────────────
// router.get("/ratings/:templateId",  userController.getRatings)
// router.post("/rate/:templateId",    userAuth, userController.submitRating)

// // ─── PURCHASE CHECK & DOWNLOAD ───────────────────────────────────
// router.get("/check-purchase/:templateId", userAuth, userTemplateController.checkPurchase)
// router.get("/download/:templateId",       userAuth, userTemplateController.downloadTemplate)

// // ─── RECEIPTS ────────────────────────────────────────────────────
// // ✅ FIXED — getUserReceipts now imported above
// router.get("/my-receipts", userAuth, getUserReceipts)

// module.exports = router




// userRouter.js — full file with forgot/reset routes added

require("dotenv").config()
const express = require("express")
const router  = express.Router()

const userController         = require("../controller/user/userController")
const userTemplateController = require("../controller/user/userTemplateController")
const userAuth               = require("../controller/middleware/userAuth")

const { getUserReceipts } = require("../controller/payment/paymentController")

// ─── AUTH ────────────────────────────────────────────────────────
// POST http://localhost:5000/userapi/register
router.post("/register",      userController.register)
// POST http://localhost:5000/userapi/login
router.post("/login",         userController.loginUser)
router.put("/update/:id",     userAuth, userController.updateUser)

// ─── FORGOT / RESET PASSWORD (no auth needed) ────────────────────
router.post("/forgot-password",          userController.forgotPassword)
router.post("/reset-password/:token",    userController.resetPassword)

// ─── TEMPLATES ───────────────────────────────────────────────────
router.get("/templates",                        userController.findAllTemplates)
router.get("/templates/latest",                 userController.findLatestTemplates)
router.get("/templates/category/:categoryId",   userController.findTemplatesByCategory)
router.get("/template/:id",                     userTemplateController.displaySingleTemplate)

// ─── CART ────────────────────────────────────────────────────────
router.post("/add-to-cart",       userAuth, userTemplateController.addToCart)
router.get("/view-cart",          userAuth, userTemplateController.viewCart)
router.delete("/remove-cart/:id", userAuth, userTemplateController.removeFromCart)

// ─── RATINGS ─────────────────────────────────────────────────────
router.get("/ratings/:templateId",  userController.getRatings)
router.post("/rate/:templateId",    userAuth, userController.submitRating)

// ─── PURCHASE CHECK & DOWNLOAD ───────────────────────────────────
router.get("/check-purchase/:templateId", userAuth, userTemplateController.checkPurchase)
router.get("/download/:templateId",       userAuth, userTemplateController.downloadTemplate)

// ─── RECEIPTS ────────────────────────────────────────────────────
router.get("/my-receipts", userAuth, getUserReceipts)

module.exports = router