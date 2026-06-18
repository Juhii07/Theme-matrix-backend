const mongoose = require("mongoose")

const vendorSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile:   { type: String },
  address:  { type: String },
  status:   { type: String, enum: ["enable", "disable"], default: "enable" },
  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    ifscCode:      String,
    bankName:      String,
    branchName:    String,
    upiId:         String,
    panCard:       String,
  },

  // ✅ FIXED: both fields use "Expires" not "Expiry"
  resetPasswordToken:   { type: String,  default: null },
  resetPasswordExpires: { type: Number,  default: null },  // ✅ was "Expiry" before

}, { timestamps: true })

module.exports = mongoose.model("Vendor", vendorSchema)