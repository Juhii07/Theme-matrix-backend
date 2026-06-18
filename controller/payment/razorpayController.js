// controller/payment/razorpayController.js
const Razorpay = require("razorpay")
const crypto   = require("crypto")

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// POST /api/payment/create-order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body
    const options = {
      amount:   amount * 100,
      currency: "INR",
      receipt:  "receipt_" + Date.now(),
    }
    const order = await razorpay.orders.create(options)
    console.log("✅ Razorpay Order Created:", order.id)
    res.json(order)
  } catch (error) {
    console.log("❌ Create Order Error:", error.message)
    res.status(500).json({ message: error.message })
  }
}

// POST /api/payment/verify-payment
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body

    const body = razorpay_order_id + "|" + razorpay_payment_id

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex")

    if (expectedSignature === razorpay_signature) {
      console.log("✅ Payment Verified:", razorpay_payment_id)
      res.json({ success: true, message: "Payment Verified" })
    } else {
      console.log("❌ Payment Verification Failed")
      res.status(400).json({ success: false, message: "Payment Failed" })
    }
  } catch (error) {
    console.log("❌ Verify Payment Error:", error.message)
    res.status(500).json({ message: error.message })
  }
}