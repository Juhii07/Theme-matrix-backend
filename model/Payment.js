const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",      
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",        
  },
  totalAmount:       { type: Number, default: 0 },
  adminShare:        { type: Number, default: 0 },
  vendorShare:       { type: Number, default: 0 },
  status:            { type: String, enum: ["pending", "paid"], default: "pending" },
  receiptFile:       { type: String, default: null },
  receiptUrl:        { type: String, default: null },
  receiptNote:       { type: String, default: "" },
  userReceiptFile:   { type: String, default: null },
  userReceiptNumber: { type: String, default: null },
  paidAt:            { type: Date,   default: null },
}, { timestamps: true })

module.exports = mongoose.model("Payment", paymentSchema)