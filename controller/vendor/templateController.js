exports.editTemplate = async (req, res) => {
  try {

    // ✅ TEMPORARY DEBUG — remove after fixing
    console.log("=== EDIT TEMPLATE DEBUG ===")
    console.log("Template ID  :", req.params.id)
    console.log("Vendor ID    :", req.vendor.vendorId)
    console.log("Body keys    :", Object.keys(req.body))
    console.log("Files        :", req.files ? Object.keys(req.files) : "none")
    console.log("designName   :", req.body.designName)
    console.log("regularPrice :", req.body.regularPrice)
    console.log("===========================")

    const existing = await Template.findOne({
      _id:      req.params.id,
      vendorId: req.vendor.vendorId
    })

    console.log("Template found:", existing ? "YES" : "NO")

    if (!existing) {
      return res.status(404).json({ message: "Template not found" })
    }

    const updateData = {}

    if (req.body.designName)
      updateData.designName           = req.body.designName
    if (req.body.demoUrl !== undefined)
      updateData.demoUrl              = req.body.demoUrl
    if (req.body.regularPrice)
      updateData.regularPrice         = req.body.regularPrice
    if (req.body.supportPrice)
      updateData.supportPrice         = req.body.supportPrice
    if (req.body.designDescriptionOne)
      updateData.designDescriptionOne = req.body.designDescriptionOne
    if (req.body.designDescriptionTwo)
      updateData.designDescriptionTwo = req.body.designDescriptionTwo
    if (req.body.shortDescription !== undefined)
      updateData.shortDescription     = req.body.shortDescription
    if (req.body.designCategory)
      updateData.designCategory       = req.body.designCategory

    if (req.body.designKeyFeatures) {
      updateData.designKeyFeatures = Array.isArray(req.body.designKeyFeatures)
        ? req.body.designKeyFeatures
        : req.body.designKeyFeatures
            .split(",")
            .map(f => f.trim())
            .filter(Boolean)
    }

    if (req.files?.designThumbnail?.[0]) {
      updateData.designThumbnail = req.files.designThumbnail[0].filename
    }
    if (req.files?.designPackage?.[0]) {
      updateData.designPackage = req.files.designPackage[0].filename
    }
    if (req.files?.previewImages?.length > 0) {
      updateData.previewImages = req.files.previewImages.map(f => f.filename)
    }

    updateData.designStatus = "pending"

    console.log("Update data  :", updateData)

    const updated = await Template.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: 'after' }
    )

    console.log("Update result:", updated ? "SUCCESS" : "FAILED")

    res.status(200).json({
      message: "Template updated successfully",
      template: updated
    })

  } catch (error) {
    console.log("❌ Edit Template Error :", error.message)
    console.log("❌ Full Error          :", error)
    res.status(500).json({ message: error.message })
  }
}

const Template = require("../../model/Template")

// ─────────────────────────────────────────────
// 1. Upload Template
// POST /vendorapi/upload-template  (multipart)
// ─────────────────────────────────────────────
exports.uploadTemplate = async (req, res) => {
  try {

    const designThumbnail = req.files?.designThumbnail?.[0]?.filename || null
    const designPackage   = req.files?.designPackage?.[0]?.filename   || null
    const previewImages   = req.files?.previewImages?.map(f => f.filename) || []

    const template = new Template({
      designName:           req.body.designName,
      vendorId:             req.vendor.vendorId,
      designThumbnail:      designThumbnail,
      designPackage:        designPackage,
      previewImages:        previewImages,
      demoUrl:              req.body.demoUrl,
      regularPrice:         req.body.regularPrice,
      supportPrice:         req.body.supportPrice,
      designDescriptionOne: req.body.designDescriptionOne,
      designDescriptionTwo: req.body.designDescriptionTwo,
      shortDescription:     req.body.shortDescription || "",
      designKeyFeatures:    Array.isArray(req.body.designKeyFeatures)
        ? req.body.designKeyFeatures
        : req.body.designKeyFeatures
          ? req.body.designKeyFeatures.split(",").map(f => f.trim()).filter(Boolean)
          : [],
      designCategory:       req.body.designCategory
    })

    await template.save()

    res.status(201).json({
      message: "Template uploaded successfully",
      template
    })

  } catch (error) {
    console.log("Upload Error:", error.message)
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────
// 2. Vendor Own Templates
// GET /vendorapi/my-templates
// ─────────────────────────────────────────────
exports.myTemplates = async (req, res) => {
  try {
    const templates = await Template.find({
      vendorId: req.vendor.vendorId
    }).populate("designCategory", "name")
    res.status(200).json(templates)
  } catch (error) {
    console.log("My Templates Error:", error.message)
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────
// 3. Single Template (Vendor Only)
// GET /vendorapi/template/:id
// ─────────────────────────────────────────────
exports.viewSingleTemplate = async (req, res) => {
  try {
    const template = await Template.findOne({
      _id:      req.params.id,
      vendorId: req.vendor.vendorId
    }).populate("designCategory", "name")

    if (!template) {
      return res.status(404).json({ message: "Template not found" })
    }

    res.status(200).json(template)

  } catch (error) {
    console.log("View Single Template Error:", error.message)
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────
// 4. Edit Template (Vendor Only)
// POST /vendorapi/edit-template/:id  (multipart)
// ─────────────────────────────────────────────
exports.editTemplate = async (req, res) => {
  try {

    // ✅ check template exists and belongs to vendor
    const existing = await Template.findOne({
      _id:      req.params.id,
      vendorId: req.vendor.vendorId
    })

    if (!existing) {
      return res.status(404).json({ message: "Template not found" })
    }

    // ✅ build update object
    const updateData = {}

    // text fields
    if (req.body.designName)
      updateData.designName           = req.body.designName
    if (req.body.demoUrl !== undefined)
      updateData.demoUrl              = req.body.demoUrl
    if (req.body.regularPrice)
      updateData.regularPrice         = req.body.regularPrice
    if (req.body.supportPrice)
      updateData.supportPrice         = req.body.supportPrice
    if (req.body.designDescriptionOne)
      updateData.designDescriptionOne = req.body.designDescriptionOne
    if (req.body.designDescriptionTwo)
      updateData.designDescriptionTwo = req.body.designDescriptionTwo
    if (req.body.shortDescription !== undefined)
      updateData.shortDescription     = req.body.shortDescription
    if (req.body.designCategory)
      updateData.designCategory       = req.body.designCategory

    // ✅ handle designKeyFeatures — string or array
    if (req.body.designKeyFeatures) {
      updateData.designKeyFeatures = Array.isArray(req.body.designKeyFeatures)
        ? req.body.designKeyFeatures
        : req.body.designKeyFeatures
            .split(",")
            .map(f => f.trim())
            .filter(Boolean)
    }

    // ✅ file fields — only update if new file uploaded
    if (req.files?.designThumbnail?.[0]) {
      updateData.designThumbnail = req.files.designThumbnail[0].filename
    }
    if (req.files?.designPackage?.[0]) {
      updateData.designPackage = req.files.designPackage[0].filename
    }
    if (req.files?.previewImages?.length > 0) {
      updateData.previewImages = req.files.previewImages.map(f => f.filename)
    }

    // ✅ reset to pending so admin reviews again
    updateData.designStatus = "pending"

    // ✅ use findByIdAndUpdate to avoid validation issues
    const updated = await Template.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: 'after' }
    )

    res.status(200).json({
      message: "Template updated successfully",
      template: updated
    })

  } catch (error) {
    console.log("Edit Template Error :", error.message)
    console.log("Full Error          :", error)
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────
// 5. Delete Template (Soft Delete)
// POST /vendorapi/delete-template/:id
// ─────────────────────────────────────────────
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findOneAndUpdate(
      {
        _id:      req.params.id,
        vendorId: req.vendor.vendorId
      },
      { designStatus: "disabled" },
      { returnDocument: 'after' }
    )

    if (!template) {
      return res.status(404).json({ message: "Template not found" })
    }

    res.status(200).json({
      message: "Template disabled successfully",
      template
    })

  } catch (error) {
    console.log("Delete Template Error:", error.message)
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────
// TOGGLE TEMPLATE
// POST /vendorapi/toggle-template/:id
// ─────────────────────────────────────────────
exports.toggleTemplate = async (req, res) => {
  try {
    const template = await Template.findOne({
      _id:      req.params.id,
      vendorId: req.vendor.vendorId,
    })

    if (!template) {
      return res.status(404).json({ msg: "Template not found" })
    }

    if (template.designStatus === "rejected") {
      return res.status(400).json({
        msg: `Cannot toggle a "rejected" template.`
      })
    }

    if (template.designStatus === "approved") {
      template.designStatus = "disabled"
      template.isEnabled    = false
    } else if (template.designStatus === "disabled") {
      template.designStatus = "approved"
      template.isEnabled    = true
    } else if (template.designStatus === "pending") {
      template.isEnabled = !template.isEnabled
    }

    await template.save()

    res.json({
      msg:          "Template toggle updated successfully",
      isEnabled:    template.isEnabled,
      designStatus: template.designStatus,
    })

  } catch (err) {
    console.error("Toggle Error:", err.message)
    res.status(500).json({ msg: "Toggle failed", error: err.message })
  }
}