const mongoose = require("mongoose")

const templateSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",      
    required: true,
  },
  designCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",   
  },
  designName:        { type: String, required: true },
  demoUrl:           { type: String, default: "" },
  regularPrice:      { type: Number, required: true },
  supportPrice:      { type: Number, default: 0 },
  designThumbnail:   { type: String, default: "" },
  designPackage:     { type: String, default: "" },
  previewImages:     [{ type: String }],
  designKeyFeatures: [{ type: String }],
  designTags:        [{ type: String }],
  designDescription:  { type: String, default: "" },
  designDescription2: { type: String, default: "" },
  designStatus:      { type: String, enum: ["pending","approved","rejected","disabled"], default: "pending" },
  adminComment:      { type: String, default: "" },
  isEnabled:         { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model("template", templateSchema)