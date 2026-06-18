// const express = require("express");
// const router = express.Router();
// const { createOrder, verifyPayment } = require("../controller/payment/paymentController");

// // POST http://localhost:5000/api/payment/create-order
// router.post("/create-order", createOrder);

// // POST http://localhost:5000/api/payment/verify-payment
// router.post("/verify-payment", verifyPayment);



// module.exports = router;




// paymentRouter.js
const express = require("express")
const router  = express.Router()

// ✅ FIXED — import from razorpayController, NOT paymentController
const { createOrder, verifyPayment } = require("../controller/payment/razorpayController")

// POST http://localhost:5000/api/payment/create-order
router.post("/create-order",   createOrder)

// POST http://localhost:5000/api/payment/verify-payment
router.post("/verify-payment", verifyPayment)

module.exports = router