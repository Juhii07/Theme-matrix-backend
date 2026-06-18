const Payment = require("../../model/Payment")

require("../../model/User")
require("../../model/Order")
require("../../model/Template")

// GET /vendorapi/my-payments
exports.getMyPayments = async (req, res) => {
  try {
    const vendorId = req.vendor?.vendorId
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" })

    const payments = await Payment.find({ vendorId })
      .populate("orderId",    "finalTotal createdAt razorpayOrderId")
      .populate("userId",     "name email")
      .sort({ createdAt: -1 })

    res.json(payments)
  } catch (err) {
    console.log("getMyPayments ERROR:", err.message)
    res.status(500).json({ message: err.message })
  }
}

// GET /vendorapi/payments
exports.getVendorPayments = async (req, res) => {
  try {
    const vendorId = req.vendor?.vendorId
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" })

    const payments = await Payment.find({ vendorId })
      .populate("orderId", "finalTotal createdAt")
      .populate("userId",  "name email")
      .sort({ createdAt: -1 })

    res.json(payments)
  } catch (err) {
    console.log("getVendorPayments ERROR:", err.message)
    res.status(500).json({ message: err.message })
  }
}
