const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  percentage: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageLimit: {
    type: Number,
    default: null // null = unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Discount", discountSchema);