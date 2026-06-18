const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log("vendorAuth decoded:", decoded)

    // ✅ expose both so templateController works either way
    req.vendor = {
      vendorId: decoded.vendorId,   // ← from jwt.sign({ vendorId: vendor._id })
      id:       decoded.vendorId,   // ← alias
      role:     decoded.role
    };

    console.log("req.vendor set to:", req.vendor)

    next();
  } catch (err) {
    console.log("vendorAuth error:", err.message)
    return res.status(401).json({ message: "Invalid token" });
  }
};