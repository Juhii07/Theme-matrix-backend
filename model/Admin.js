const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["enable", "disable"],
      default: "enable",
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { collection: "admin" }
);

module.exports = mongoose.model("admin", adminSchema);
