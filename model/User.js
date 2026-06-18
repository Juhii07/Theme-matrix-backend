const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile:   { type: String },
  status:   { type: String, enum: ["enable", "disable"], default: "enable" },
  resetPasswordToken:   { type: String,  default: null },
  resetPasswordExpires: { type: Number,  default: null },
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)