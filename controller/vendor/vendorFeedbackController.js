const Rating   = require("../../model/Rating")
const Template = require("../../model/Template")

// GET all ratings for vendor's templates
exports.getMyTemplateFeedback = async (req, res) => {
  try {
    const vendorId = req.vendor?.vendorId || req.user?.id

    const templates   = await Template.find({ vendorId }).select("_id designName")
    const templateIds = templates.map(t => t._id)

    const ratings = await Rating.find({ templateId: { $in: templateIds } })
      .populate("templateId", "designName designThumbnail designStatus")
      .populate("userId",     "name email")
      .sort({ createdAt: -1 })

    res.json(ratings)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: e.message })
  }
}

// GET ratings for a specific template
exports.getTemplateFeedback = async (req, res) => {
  try {
    const vendorId = req.vendor?.vendorId || req.user?.id
    const template = await Template.findOne({ _id: req.params.templateId, vendorId })
    if (!template) return res.status(403).json({ message: "Not your template" })

    const ratings = await Rating.find({ templateId: req.params.templateId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })

    res.json(ratings)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}