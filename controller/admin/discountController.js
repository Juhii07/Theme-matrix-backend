const Discount = require("../../model/Discount");

// 1. Create Discount
exports.createDiscount = async (req, res) => {
  try {
    const { percentage, startDate, endDate } = req.body;

    const discount = new Discount({
      code:       `DISCOUNT${Date.now()}`, // auto generate
      percentage,
      startDate,
      endDate,
      usageLimit: null
    });

    await discount.save();
    res.status(201).json({ message: "Discount created successfully", discount });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get All Discounts
exports.getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.status(200).json(discounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Toggle Active/Inactive
exports.toggleDiscount = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) return res.status(404).json({ message: "Discount not found" });

    discount.isActive = !discount.isActive;
    await discount.save();

    res.status(200).json({ message: "Discount status updated", discount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Delete Discount
exports.deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount) return res.status(404).json({ message: "Discount not found" });

    res.status(200).json({ message: "Discount deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. ✅ Auto Get Best Active Discount (for user - no code needed)
exports.getActiveDiscount = async (req, res) => {
  try {
    const now = new Date();

    // Find the best active discount (highest percentage)
    const discount = await Discount.findOne({
      isActive:  true,
      startDate: { $lte: now },
      endDate:   { $gte: now }
    }).sort({ percentage: -1 }); // highest % first

    if (!discount) {
      return res.status(200).json({ discount: null });
    }

    res.status(200).json({
      discount: {
        code:       discount.code,
        percentage: discount.percentage
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Apply Discount (increment usedCount after purchase)
exports.applyDiscount = async (req, res) => {
  try {
    const { code } = req.body;

    const discount = await Discount.findOne({ code: code.toUpperCase() });
    if (!discount) return res.status(404).json({ message: "Discount not found" });

    discount.usedCount += 1;
    await discount.save();

    res.status(200).json({ message: "Discount applied successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};