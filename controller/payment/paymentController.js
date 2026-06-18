const Payment = require("../../model/Payment")
const path    = require("path")
const fs      = require("fs")
const PDFDoc  = require("pdfkit")

// ✅ FIXED paths — ../../uploads/receipts
const generateUserReceiptPDF = async (payment, order, user, template) => {
  return new Promise((resolve, reject) => {
    const receiptNumber = `RCP-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const fileName      = `receipt_${receiptNumber}.pdf`
    const dir           = path.join(__dirname, "../../uploads/receipts")
    const filePath      = path.join(dir, fileName)

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

    const doc    = new PDFDoc({ margin: 50 })
    const stream = fs.createWriteStream(filePath)
    doc.pipe(stream)

    doc.fontSize(22).font("Helvetica-Bold").text("ThemeMatrix", 50, 50)
    doc.fontSize(10).font("Helvetica").fillColor("#666").text("Premium UI Templates Marketplace", 50, 78)
    doc.moveTo(50, 100).lineTo(550, 100).strokeColor("#a855f7").lineWidth(2).stroke()
    doc.fontSize(18).font("Helvetica-Bold").fillColor("#1a1a2e").text("PAYMENT RECEIPT", 50, 120)
    doc.fontSize(10).font("Helvetica").fillColor("#666")
      .text(`Receipt No: ${receiptNumber}`, 50, 145)
      .text(`Date: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, 50, 160)
    doc.fontSize(12).font("Helvetica-Bold").fillColor("#1a1a2e").text("Bill To:", 50, 195)
    doc.fontSize(10).font("Helvetica").fillColor("#444")
      .text(user?.name || "Customer", 50, 212)
      .text(user?.email || "", 50, 227)
    doc.moveTo(50, 255).lineTo(550, 255).strokeColor("#e9d5ff").lineWidth(1).stroke()
    doc.fontSize(11).font("Helvetica-Bold").fillColor("#7c3aed")
      .text("#", 50, 270).text("ITEM", 80, 270).text("AMOUNT", 460, 270)
    doc.moveTo(50, 288).lineTo(550, 288).strokeColor("#e9d5ff").lineWidth(0.5).stroke()
    doc.fontSize(10).font("Helvetica").fillColor("#444")
      .text("1", 50, 300)
      .text(template?.designName || "Template", 80, 300)
      .text(`Rs. ${payment.totalAmount?.toLocaleString("en-IN")}`, 460, 300)
    doc.moveTo(50, 325).lineTo(550, 325).strokeColor("#e9d5ff").lineWidth(1).stroke()
    doc.fontSize(12).font("Helvetica-Bold").fillColor("#7c3aed")
      .text("TOTAL PAID", 380, 340)
      .text(`Rs. ${payment.totalAmount?.toLocaleString("en-IN")}`, 460, 340)
    doc.roundedRect(50, 370, 200, 30, 5).fill("#dcfce7")
    doc.fontSize(11).font("Helvetica-Bold").fillColor("#15803d").text("PAYMENT SUCCESSFUL", 60, 380)
    doc.moveTo(50, 430).lineTo(550, 430).strokeColor("#e9d5ff").lineWidth(1).stroke()
    doc.fontSize(9).font("Helvetica").fillColor("#999")
      .text("Thank you for purchasing from ThemeMatrix!", 50, 445)
      .text("For support: support@themematrix.com", 50, 460)
    doc.end()

    stream.on("finish", () => resolve({ fileName, receiptNumber }))
    stream.on("error", reject)
  })
}

const generateVendorReceiptPDF = async (payment, vendor, note) => {
  return new Promise((resolve, reject) => {
    const receiptNumber = `VRC-${Date.now()}`
    const fileName      = `vendor_receipt_${receiptNumber}.pdf`
    const dir           = path.join(__dirname, "../../uploads/receipts")
    const filePath      = path.join(dir, fileName)

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

    const doc    = new PDFDoc({ margin: 50 })
    const stream = fs.createWriteStream(filePath)
    doc.pipe(stream)

    doc.fontSize(22).font("Helvetica-Bold").text("ThemeMatrix", 50, 50)
    doc.fontSize(10).font("Helvetica").fillColor("#666").text("Vendor Payment Receipt", 50, 78)
    doc.moveTo(50, 100).lineTo(550, 100).strokeColor("#a855f7").lineWidth(2).stroke()
    doc.fontSize(18).font("Helvetica-Bold").fillColor("#1a1a2e").text("VENDOR PAYMENT RECEIPT", 50, 120)
    doc.fontSize(10).font("Helvetica").fillColor("#666")
      .text(`Receipt No: ${receiptNumber}`, 50, 145)
      .text(`Date: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, 50, 160)
    doc.fontSize(12).font("Helvetica-Bold").fillColor("#1a1a2e").text("Pay To:", 50, 195)
    doc.fontSize(10).font("Helvetica").fillColor("#444")
      .text(vendor?.name || "Vendor", 50, 212)
      .text(vendor?.email || "", 50, 227)
    doc.moveTo(50, 255).lineTo(550, 255).strokeColor("#e9d5ff").lineWidth(1).stroke()
    doc.fontSize(11).font("Helvetica-Bold").fillColor("#7c3aed")
      .text("DESCRIPTION", 50, 270).text("AMOUNT", 460, 270)
    doc.moveTo(50, 288).lineTo(550, 288).strokeColor("#e9d5ff").lineWidth(0.5).stroke()
    doc.fontSize(10).font("Helvetica").fillColor("#444")
      .text("Order Total", 50, 300)
      .text(`Rs. ${payment.totalAmount?.toLocaleString("en-IN")}`, 460, 300)
    doc.fillColor("#dc2626")
      .text("Admin Commission (30%)", 50, 320)
      .text(`- Rs. ${payment.adminShare?.toLocaleString("en-IN")}`, 460, 320)
    doc.moveTo(50, 340).lineTo(550, 340).strokeColor("#e9d5ff").lineWidth(0.5).stroke()
    doc.fontSize(12).font("Helvetica-Bold").fillColor("#059669")
      .text("YOUR SHARE (70%)", 50, 355)
      .text(`Rs. ${payment.vendorShare?.toLocaleString("en-IN")}`, 460, 355)
    if (note) {
      doc.moveTo(50, 385).lineTo(550, 385).strokeColor("#e9d5ff").lineWidth(0.5).stroke()
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#666").text("Note from Admin:", 50, 400)
      doc.fontSize(10).font("Helvetica").fillColor("#444").text(note, 50, 418)
    }
    doc.moveTo(50, 470).lineTo(550, 470).strokeColor("#e9d5ff").lineWidth(1).stroke()
    doc.fontSize(9).font("Helvetica").fillColor("#999")
      .text("ThemeMatrix — Designed & Developed by Survivor Infotech", 50, 485)
    doc.end()

    stream.on("finish", () => resolve({ fileName, receiptNumber }))
    stream.on("error", reject)
  })
}

const createPaymentAfterOrder = async (orderId) => {
  try {
    const Order    = require("../../model/Order")
    const Template = require("../../model/Template")

    const order = await Order.findById(orderId)
      .populate("userId")
      .populate({ path: "templateId", populate: { path: "vendorId" } })

    if (!order) throw new Error("Order not found")

    const totalAmount = order.totalAmount || order.finalTotal || order.amount || 0
    const adminShare  = Math.round(totalAmount * 0.3)
    const vendorShare = Math.round(totalAmount * 0.7)
    const vendorId    = order.templateId?.vendorId?._id || order.vendorId

    const { fileName, receiptNumber } = await generateUserReceiptPDF(
      { totalAmount },
      order,
      order.userId,
      order.templateId
    )

    const payment = await Payment.create({
      orderId:           orderId,
      userId:            order.userId._id,
      vendorId:          vendorId,
      templateId:        order.templateId?._id,
      totalAmount,
      adminShare,
      vendorShare,
      userReceiptNumber: receiptNumber,
      userReceiptFile:   `receipts/${fileName}`,
      status:            "pending",
    })

    console.log("✅ Payment created:", payment._id)
    return payment
  } catch (e) {
    console.log("Payment creation error:", e)
  }
}

const getAdminPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId",     "name email")
      .populate("vendorId",   "name email")
      .populate("templateId", "designName regularPrice")
      .populate("orderId")
      .sort({ createdAt: -1 })
    res.json(payments)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: e.message })
  }
}

const sendReceiptToVendor = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("vendorId", "name email")

    if (!payment) return res.status(404).json({ message: "Payment not found" })

    const note = req.body.note || ""
    const { fileName } = await generateVendorReceiptPDF(payment, payment.vendorId, note)

    payment.receiptFile = `receipts/${fileName}`
    payment.receiptNote = note
    payment.status      = "paid"
    payment.paidAt      = new Date()
    await payment.save()

    res.json({ message: "Receipt sent to vendor", payment })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: e.message })
  }
}

const getVendorPayments = async (req, res) => {
  try {
    const vendorId = req.user?.id || req.vendor?.vendorId
    const payments = await Payment.find({ vendorId })
      .populate("userId",     "name email")
      .populate("templateId", "designName")
      .populate("orderId")
      .sort({ createdAt: -1 })
    res.json(payments)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: e.message })
  }
}

// ✅ THIS is what userRouter.js needs
const getUserReceipts = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userid
    const payments = await Payment.find({ userId })
      .populate("templateId", "designName regularPrice designThumbnail")
      .populate("vendorId",   "name")
      .sort({ createdAt: -1 })
    res.json(payments)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: e.message })
  }
}

module.exports = {
  createPaymentAfterOrder,
  getAdminPayments,
  sendReceiptToVendor,
  getVendorPayments,
  getUserReceipts,   // ✅ exported correctly
}