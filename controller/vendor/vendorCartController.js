const mongoose = require("mongoose")
const Template  = require("../../model/Template")
const Cart      = require("../../model/Cart")

// ✅ pre-require User so populate works
require("../../model/User")

exports.viewVendorCartProducts = async (req, res) => {
  try {
    const vendorId = req.vendor?.vendorId
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" })

    const vendorObjectId = new mongoose.Types.ObjectId(vendorId)

    // get all templates belonging to this vendor
    const templates = await Template.find({ vendorId: vendorObjectId }).select("_id")

    if (!templates.length) return res.json([])

    const templateIds = templates.map(t => t._id)

    const cartItems = await Cart.find({ templateId: { $in: templateIds } })
      .populate("userId",     "name email")
      .populate("templateId", "designName regularPrice designThumbnail")
      .sort({ createdAt: -1 })

    res.json(cartItems)
  } catch (err) {
    console.log("viewVendorCartProducts ERROR:", err.message)
    res.status(500).json({ message: err.message })
  }
}