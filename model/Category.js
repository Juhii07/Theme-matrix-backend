const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
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
      ref: "Admin",  
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "category" }
);

module.exports = mongoose.model("Category", categorySchema);