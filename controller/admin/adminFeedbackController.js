const Rating   = require("../../model/Rating")
const Template = require("../../model/Template")

// ✅ GET all feedback
exports.getAllFeedback = async (req, res) => {
  try {
    // ✅ pre-require all models that populate needs
    require("../../model/User")
    require("../../model/Vendor")

    const ratings = await Rating.find()
      .populate({
        path:     "templateId",
        select:   "designName designThumbnail designStatus vendorId",
        populate: { path: "vendorId", select: "name email" }
      })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })

    res.json(ratings)
  } catch (e) {
    console.log("getAllFeedback ERROR:", e.message)
    res.status(500).json({ message: e.message })
  }
}

// ✅ GET ratings for specific template
exports.getFeedbackByTemplate = async (req, res) => {
  try {
    require("../../model/User")
    const ratings = await Rating.find({ templateId: req.params.templateId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
    res.json(ratings)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

// ✅ Toggle review visibility
exports.toggleReviewVisibility = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id)
    if (!rating) return res.status(404).json({ message: "Rating not found" })
    rating.isVisible = !rating.isVisible
    await rating.save()
    res.json({
      message:   rating.isVisible ? "Review is now visible" : "Review is now hidden",
      isVisible: rating.isVisible,
    })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

// ✅ Resolve complaint
exports.resolveComplaint = async (req, res) => {
  try {
    require("../../model/User")
    require("../../model/Vendor")

    const rating = await Rating.findById(req.params.id)
      .populate({
        path:     "templateId",
        select:   "designName vendorId",
        populate: { path: "vendorId", select: "name email" }
      })

    if (!rating) return res.status(404).json({ message: "Rating not found" })

    rating.complaintStatus = "resolved"
    rating.resolvedAt      = new Date()

    const vendorMessage = req.body.vendorMessage || ""
    if (vendorMessage) rating.vendorMessage = vendorMessage

    await rating.save()

    res.json({
      message:        "Complaint resolved successfully",
      rating,
      vendorNotified: !!vendorMessage,
    })
  } catch (e) {
    console.log("resolveComplaint ERROR:", e.message)
    res.status(500).json({ message: e.message })
  }
}

// ✅ Toggle template enable/disable
exports.toggleTemplateStatus = async (req, res) => {
  try {
    const template = await Template.findById(req.params.templateId)
    if (!template) return res.status(404).json({ message: "Template not found" })
    template.designStatus = template.designStatus === "approved" ? "disabled" : "approved"
    await template.save()
    res.json({
      message:      "Template " + (template.designStatus === "approved" ? "enabled" : "disabled"),
      designStatus: template.designStatus,
    })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

// ✅ Delete review
exports.deleteReview = async (req, res) => {
  try {
    await Rating.findByIdAndDelete(req.params.id)
    res.json({ message: "Review deleted successfully" })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}