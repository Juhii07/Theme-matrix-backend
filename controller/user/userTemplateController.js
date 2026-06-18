const Template = require("../../model/Template");
const Cart     = require("../../model/Cart");
const Order    = require("../../model/Order");
const path     = require("path");
const fs       = require("fs");

// 1. Display Single Template
// GET http://localhost:5000/userapi/template/:id
exports.displaySingleTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id)
      .populate("designCategory", "name")
      .populate("vendorId", "name email")

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.status(200).json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Add To Cart
// POST http://localhost:5000/userapi/add-to-cart
exports.addToCart = async (req, res) => {
  try {
    const template = await Template.findById(req.body.templateId);

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    const existing = await Cart.findOne({
      userId:     req.user.userid,
      templateId: template._id
    })

    if (existing) {
      return res.status(400).json({ message: "Template already in cart" })
    }

    const cartItem = new Cart({
      userId:     req.user.userid,
      templateId: template._id,
      price:      template.regularPrice
    });

    await cartItem.save();

    res.status(201).json({
      message: "Template added to cart",
      cartItem
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. View Cart
// GET http://localhost:5000/userapi/view-cart
exports.viewCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({
      userId: req.user.userid
    }).populate({
      path:   "templateId",
      select: "designName designThumbnail regularPrice designStatus isEnabled designCategory designPackage",
      populate: {
        path:   "designCategory",
        select: "name"
      }
    })

    const validItems = cartItems.filter(item => item.templateId !== null)
    res.status(200).json(validItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Remove From Cart
// DELETE http://localhost:5000/userapi/remove-cart/:id
exports.removeFromCart = async (req, res) => {
  try {
    const deleted = await Cart.findOneAndDelete({
      _id:    req.params.id,
      userId: req.user.userid
    })

    if (!deleted) {
      return res.status(404).json({ message: "Cart item not found" })
    }

    res.status(200).json({ message: "Item removed from cart" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ 5. Check if user purchased a template
// GET http://localhost:5000/userapi/check-purchase/:templateId
exports.checkPurchase = async (req, res) => {
  try {
    const userId     = req.user.userid
    const templateId = req.params.templateId

    // Check if any order contains this template for this user
    const order = await Order.findOne({
      userId: userId,
      "items.templateId": templateId,
      status: "completed"
    })

    res.status(200).json({
      purchased: !!order,
      orderId:   order?._id || null
    })
  } catch (error) {
    console.log("Check Purchase Error:", error.message)
    res.status(500).json({ message: error.message })
  }
}

// ✅ 6. Download template zip file
// GET http://localhost:5000/userapi/download/:templateId
exports.downloadTemplate = async (req, res) => {
  try {
    const userId     = req.user.userid
    const templateId = req.params.templateId

    // ✅ Step 1 — Check user purchased this template
    const order = await Order.findOne({
      userId: userId,
      "items.templateId": templateId,
      status: "completed"
    })

    if (!order) {
      return res.status(403).json({
        message: "Access denied. Please purchase this template first."
      })
    }

    // ✅ Step 2 — Get template and check designPackage exists
    const template = await Template.findById(templateId)

    if (!template) {
      return res.status(404).json({ message: "Template not found" })
    }

    if (!template.designPackage) {
      return res.status(404).json({
        message: "No downloadable file available for this template."
      })
    }

    // ✅ Step 3 — Build file path and send file
    const filePath = path.join(__dirname, "../../uploads", template.designPackage)

    // Check file exists on disk
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "File not found on server. Please contact support."
      })
    }

    // ✅ Step 4 — Send file as download
    const fileName = `${template.designName || "template"}.zip`
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`)
    res.setHeader("Content-Type", "application/zip")
    res.sendFile(filePath)

    console.log(`✅ Download: User ${userId} downloaded template ${templateId}`)

  } catch (error) {
    console.log("Download Error:", error.message)
    res.status(500).json({ message: error.message })
  }
}