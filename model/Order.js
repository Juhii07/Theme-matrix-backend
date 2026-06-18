const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",        
    required: true,
  },
  items: [{
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "template",  
    },
    price: { type: Number, default: 0 }
  }],
  subtotal:        { type: Number, default: 0 },
  discountCode:    { type: String, default: "" },
  discountPercent: { type: Number, default: 0 },
  discountAmount:  { type: Number, default: 0 },
  finalTotal:      { type: Number, default: 0 },
  paymentId:       { type: String, default: "" },
  razorpayOrderId: { type: String, default: "" },
  status:          { type: String, default: "completed" },
}, { timestamps: true })

module.exports = mongoose.model("Order", orderSchema)