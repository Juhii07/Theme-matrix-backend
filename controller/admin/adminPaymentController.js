const Payment = require("../../model/Payment")
const multer  = require("multer")
const path    = require("path")
const fs      = require("fs")

// ✅ safe pdfkit import
let PDFDoc = null
try {
  PDFDoc = require("pdfkit")
} catch (e) {
  console.log("⚠️ pdfkit not installed — run: npm install pdfkit")
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename:    (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})
const upload = multer({ storage })
exports.uploadReceipt = upload.single("receipt")

const generateUserReceiptPDF = (totalAmount, userName, userEmail, templateName, receiptNumber) => {
  return new Promise((resolve, reject) => {
    try {
      if (!PDFDoc) return resolve(null)

      const fileName = `receipt_${receiptNumber}.pdf`
      const dir      = path.join(__dirname, "../../uploads/receipts")
      const filePath = path.join(dir, fileName)

      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

      const doc    = new PDFDoc({ margin: 50 })
      const stream = fs.createWriteStream(filePath)
      doc.pipe(stream)

      doc.fontSize(22).font("Helvetica-Bold").fillColor("#1a1a2e").text("ThemeMatrix", 50, 50)
      doc.fontSize(10).font("Helvetica").fillColor("#666").text("Premium UI Templates Marketplace", 50, 78)
      doc.moveTo(50, 100).lineTo(550, 100).strokeColor("#a855f7").lineWidth(2).stroke()
      doc.fontSize(18).font("Helvetica-Bold").fillColor("#1a1a2e").text("PAYMENT RECEIPT", 50, 120)
      doc.fontSize(10).font("Helvetica").fillColor("#666")
        .text(`Receipt No: ${receiptNumber}`, 50, 145)
        .text(`Date: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, 50, 162)
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#1a1a2e").text("Bill To:", 50, 195)
      doc.fontSize(10).font("Helvetica").fillColor("#444")
        .text(userName  || "Customer", 50, 213)
        .text(userEmail || "",         50, 229)
      doc.moveTo(50, 255).lineTo(550, 255).strokeColor("#e9d5ff").lineWidth(1).stroke()
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#7c3aed")
        .text("#", 50, 272).text("ITEM", 80, 272).text("AMOUNT", 460, 272)
      doc.moveTo(50, 288).lineTo(550, 288).strokeColor("#e9d5ff").lineWidth(0.5).stroke()
      doc.fontSize(10).font("Helvetica").fillColor("#444")
        .text("1", 50, 303)
        .text(String(templateName || "Template").substring(0, 50), 80, 303)
        .text(`Rs. ${Number(totalAmount || 0).toLocaleString("en-IN")}`, 460, 303)
      doc.moveTo(50, 325).lineTo(550, 325).strokeColor("#e9d5ff").lineWidth(1).stroke()
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#7c3aed")
        .text("TOTAL PAID", 380, 342)
        .text(`Rs. ${Number(totalAmount || 0).toLocaleString("en-IN")}`, 460, 342)
      doc.roundedRect(50, 372, 200, 28, 5).fill("#dcfce7")
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#15803d").text("PAYMENT SUCCESSFUL", 60, 381)
      doc.moveTo(50, 430).lineTo(550, 430).strokeColor("#e9d5ff").lineWidth(1).stroke()
      doc.fontSize(9).font("Helvetica").fillColor("#aaa")
        .text("Thank you for purchasing from ThemeMatrix!", 50, 446)
        .text("Support: support@themematrix.com", 50, 461)
      doc.end()

      stream.on("finish", () => resolve(fileName))
      stream.on("error",  () => resolve(null))
    } catch (err) {
      console.log("PDF error:", err.message)
      resolve(null)
    }
  })
}

const generateVendorReceiptPDF = (payment, vendorName, vendorEmail, note) => {
  return new Promise((resolve, reject) => {
    try {
      if (!PDFDoc) return resolve(null)

      const receiptNumber = `VRC-${Date.now()}`
      const fileName      = `vendor_receipt_${receiptNumber}.pdf`
      const dir           = path.join(__dirname, "../../uploads/receipts")
      const filePath      = path.join(dir, fileName)

      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

      const doc    = new PDFDoc({ margin: 50 })
      const stream = fs.createWriteStream(filePath)
      doc.pipe(stream)

      doc.fontSize(22).font("Helvetica-Bold").fillColor("#1a1a2e").text("ThemeMatrix", 50, 50)
      doc.fontSize(10).font("Helvetica").fillColor("#666").text("Vendor Payment Receipt", 50, 78)
      doc.moveTo(50, 100).lineTo(550, 100).strokeColor("#a855f7").lineWidth(2).stroke()
      doc.fontSize(18).font("Helvetica-Bold").fillColor("#1a1a2e").text("VENDOR PAYMENT RECEIPT", 50, 120)
      doc.fontSize(10).font("Helvetica").fillColor("#666")
        .text(`Receipt No: ${receiptNumber}`, 50, 145)
        .text(`Date: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, 50, 162)
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#1a1a2e").text("Pay To:", 50, 195)
      doc.fontSize(10).font("Helvetica").fillColor("#444")
        .text(vendorName  || "Vendor", 50, 213)
        .text(vendorEmail || "",       50, 229)
      doc.moveTo(50, 255).lineTo(550, 255).strokeColor("#e9d5ff").lineWidth(1).stroke()
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#7c3aed")
        .text("DESCRIPTION", 50, 272).text("AMOUNT", 460, 272)
      doc.moveTo(50, 288).lineTo(550, 288).strokeColor("#e9d5ff").lineWidth(0.5).stroke()
      doc.fontSize(10).font("Helvetica").fillColor("#444")
        .text("Order Total", 50, 303)
        .text(`Rs. ${Number(payment.totalAmount || 0).toLocaleString("en-IN")}`, 460, 303)
      doc.fillColor("#dc2626")
        .text("Admin Commission (30%)", 50, 320)
        .text(`- Rs. ${Number(payment.adminShare || 0).toLocaleString("en-IN")}`, 460, 320)
      doc.moveTo(50, 340).lineTo(550, 340).strokeColor("#e9d5ff").lineWidth(0.5).stroke()
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#059669")
        .text("YOUR SHARE (70%)", 50, 357)
        .text(`Rs. ${Number(payment.vendorShare || 0).toLocaleString("en-IN")}`, 460, 357)
      if (note) {
        doc.moveTo(50, 385).lineTo(550, 385).strokeColor("#e9d5ff").lineWidth(0.5).stroke()
        doc.fontSize(10).font("Helvetica-Bold").fillColor("#666").text("Note from Admin:", 50, 400)
        doc.fontSize(10).font("Helvetica").fillColor("#444").text(String(note).substring(0, 200), 50, 417)
      }
      doc.moveTo(50, 470).lineTo(550, 470).strokeColor("#e9d5ff").lineWidth(1).stroke()
      doc.fontSize(9).font("Helvetica").fillColor("#aaa")
        .text("ThemeMatrix — Designed & Developed by Survivor Infotech", 50, 486)
      doc.end()

      stream.on("finish", () => resolve(fileName))
      stream.on("error",  () => resolve(null))
    } catch (err) {
      console.log("Vendor PDF error:", err.message)
      resolve(null)
    }
  })
}

// ✅ Called from orderController
exports.createPaymentRecord = async (orderId, vendorId, userId, totalAmount, templateName, userObj) => {
  try {
    const existing = await Payment.findOne({ orderId, vendorId })
    if (existing) return existing

    const adminShare    = Math.round((totalAmount || 0) * 0.30)
    const vendorShare   = Math.round((totalAmount || 0) * 0.70)
    const receiptNumber = `RCP-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    let userReceiptFile = null
    try {
      const fileName = await generateUserReceiptPDF(
        totalAmount,
        userObj?.name  || "Customer",
        userObj?.email || "",
        templateName   || "Template",
        receiptNumber
      )
      if (fileName) userReceiptFile = `receipts/${fileName}`
    } catch (pdfErr) {
      console.log("PDF error (non-fatal):", pdfErr.message)
    }

    const payment = new Payment({
      orderId,
      vendorId,
      userId,
      totalAmount:       totalAmount || 0,
      adminShare,
      vendorShare,
      status:            "pending",
      userReceiptNumber: receiptNumber,
      userReceiptFile,
    })

    await payment.save()
    console.log("✅ Payment created:", payment._id)
    return payment
  } catch (err) {
    console.log("createPaymentRecord error:", err.message)
    throw err
  }
}

// ✅ GET /adminapi/payments — FIXED with safe populate
exports.getAllPayments = async (req, res) => {
  try {
    // ✅ First try with full populate
    let payments = []
    try {
      payments = await Payment.find()
        .populate("userId",     "name email")
        .populate("vendorId",   "name email")
        .populate("templateId", "designName regularPrice")
        .populate("orderId",    "finalTotal createdAt")
        .sort({ createdAt: -1 })
    } catch (populateErr) {
      console.log("Populate error, trying basic query:", populateErr.message)
      // ✅ fallback — no populate
      payments = await Payment.find().sort({ createdAt: -1 })
    }

    res.json(payments)
  } catch (err) {
    console.log("getAllPayments ERROR:", err.message)
    res.status(500).json({ message: err.message })
  }
}

// ✅ POST /adminapi/payments/:id/send-receipt
exports.sendReceipt = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("vendorId", "name email")

    if (!payment) return res.status(404).json({ message: "Payment not found" })

    const note = req.body.note || ""

    try {
      const fileName = await generateVendorReceiptPDF(
        payment,
        payment.vendorId?.name,
        payment.vendorId?.email,
        note
      )
      if (fileName) payment.receiptFile = `receipts/${fileName}`
    } catch (pdfErr) {
      console.log("Vendor PDF error:", pdfErr.message)
      if (req.file) payment.receiptFile = req.file.filename
    }

    payment.receiptNote = note
    payment.status      = "paid"
    payment.paidAt      = new Date()
    await payment.save()

    res.json({ success: true, message: "Receipt sent to vendor", payment })
  } catch (err) {
    console.log("sendReceipt ERROR:", err.message)
    res.status(500).json({ message: err.message })
  }
}

// ✅ PUT /adminapi/payments/:id/status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
    if (!payment) return res.status(404).json({ message: "Payment not found" })

    payment.status = req.body.status || "paid"
    if (payment.status === "paid") payment.paidAt = new Date()
    await payment.save()

    res.json({ success: true, payment })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ✅ POST /adminapi/payments/fix-receipts
exports.fixMissingReceipts = async (req, res) => {
  try {
    const payments = await Payment.find({
      $or: [
        { userReceiptFile: null },
        { userReceiptFile: { $exists: false } }
      ]
    })
    .populate("userId",   "name email")
    .populate("vendorId", "name email")

    console.log(`Found ${payments.length} payments without receipts`)
    let fixed = 0

    for (const p of payments) {
      try {
        const receiptNumber = `RCP-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        const fileName = await generateUserReceiptPDF(
          p.totalAmount,
          p.userId?.name  || "Customer",
          p.userId?.email || "",
          "Template",
          receiptNumber
        )
        if (fileName) {
          p.userReceiptFile   = `receipts/${fileName}`
          p.userReceiptNumber = receiptNumber
          await p.save()
          fixed++
          console.log(`Fixed payment ${p._id}`)
        }
      } catch (e) {
        console.log(`Failed to fix ${p._id}:`, e.message)
      }
    }

    res.json({ message: `Fixed ${fixed} of ${payments.length} payments` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}



// controller/admin/adminPaymentController.js
// Replace ONLY the getAllPayments function — keep everything else the same

exports.getAllPayments = async (req, res) => {
  try {
    // ✅ require all models populate needs
    require("../../model/User")
    require("../../model/Vendor")
    require("../../model/Order")

    const payments = await Payment.find()
      .populate("userId",   "name email")
      .populate("vendorId", "name email")
      .populate("orderId",  "finalTotal createdAt")
      .sort({ createdAt: -1 })

    res.json(payments)
  } catch (err) {
    console.log("getAllPayments ERROR:", err.message)
    res.status(500).json({ message: err.message })
  }
}