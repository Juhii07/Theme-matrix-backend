const Order    = require("../../model/Order")
const Cart     = require("../../model/Cart")
const Discount = require("../../model/Discount")
const User     = require("../../model/User")
const { createPaymentRecord } = require("../admin/adminPaymentController")

exports.placeOrder = async (req, res) => {
  try {
    const {
      subtotal, discountCode, discountPercent,
      discountAmount, finalTotal, paymentId, razorpayOrderId
    } = req.body

    const userId = req.user.userid

    // ✅ fetch user for receipt PDF
    const userObj = await User.findById(userId).select("name email")

    const cartItems = await Cart.find({ userId })
      .populate({ path: "templateId", select: "designName regularPrice vendorId" })

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    const items = cartItems.map(item => ({
      templateId: item.templateId._id,
      price:      item.price
    }))

    const order = new Order({
      userId,
      items,
      subtotal,
      discountCode:    discountCode    || null,
      discountPercent: discountPercent || 0,
      discountAmount:  discountAmount  || 0,
      finalTotal,
      paymentId:       paymentId       || null,
      razorpayOrderId: razorpayOrderId || null,
    })

    await order.save()

    // ✅ Create payment records grouped by vendor
    try {
      const vendorTotals = {}

      for (const item of cartItems) {
        const vendorId     = item.templateId?.vendorId
        const templateName = item.templateId?.designName

        if (!vendorId) {
          console.log("⚠️ No vendorId for:", item.templateId?._id)
          continue
        }

        const key = String(vendorId)
        if (!vendorTotals[key]) {
          vendorTotals[key] = { vendorId, total: 0, templateName }
        }
        vendorTotals[key].total += item.price || 0
      }

      for (const { vendorId, total, templateName } of Object.values(vendorTotals)) {
        // ✅ pass userObj and templateName
        await createPaymentRecord(order._id, vendorId, userId, total, templateName, userObj)
      }
    } catch (paymentErr) {
      console.log("❌ Payment record error:", paymentErr.message)
    }

    if (discountCode) {
      await Discount.findOneAndUpdate(
        { code: discountCode.toUpperCase() },
        { $inc: { usedCount: 1 } }
      )
    }

    await Cart.deleteMany({ userId })

    res.status(201).json({ message: "Order placed successfully", orderId: order._id, order })
  } catch (error) {
    console.log("Place Order Error:", error.message)
    res.status(500).json({ message: error.message })
  }
}

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userid })
      .populate("items.templateId", "designName designThumbnail regularPrice demoUrl designPackage")
      .sort({ createdAt: -1 })
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.userid })
      .populate("items.templateId", "designName designThumbnail regularPrice demoUrl designPackage")
    if (!order) return res.status(404).json({ message: "Order not found" })
    res.status(200).json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}