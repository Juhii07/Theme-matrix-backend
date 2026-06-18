const mongoose = require("mongoose")

const ratingSchema = new mongoose.Schema({
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "template",    
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",       
    required: true,
  },
  rating:          { type: Number, min: 1, max: 5, required: true },
  review:          { type: String, default: "" },
  complaint:       { type: String, default: "" },
  complaintStatus: { type: String, enum: ["none", "open", "resolved"], default: "none" },
  isVisible:       { type: Boolean, default: true },
  vendorMessage:   { type: String, default: "" },
  resolvedAt:      { type: Date,   default: null },
}, { timestamps: true })

ratingSchema.index({ templateId: 1, userId: 1 }, { unique: true })

module.exports = mongoose.model("Rating", ratingSchema)