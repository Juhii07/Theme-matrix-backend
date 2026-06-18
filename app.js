require('dotenv').config()
const express = require('express')
const cors    = require('cors')

const connectDB = require('./db');
connectDB()

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173" }));

// Static folder
app.use("/uploads", express.static("uploads"));

// ─── Routes ───────────────────────────────────────────────────
const userRouter     = require('./router/userRouter')
const adminRoutes    = require("./router/adminRouter");
const vendorRouter   = require('./router/vendorRouter')
const discountRoutes = require("./router/discountRoutes");
const orderRoutes    = require("./router/orderRouter");   // ✅ has me, update, orders
const paymentRoutes  = require("./router/paymentRouter");

app.use('/userapi',     userRouter);      // http://localhost:5000/userapi/...
app.use("/adminapi",    adminRoutes);     // http://localhost:5000/adminapi/...
app.use('/vendorapi',   vendorRouter);    // http://localhost:5000/vendorapi/...
app.use("/api",         discountRoutes);  // http://localhost:5000/api/...
app.use("/api",         orderRoutes);     // http://localhost:5000/api/user/me etc
app.use("/api/payment", paymentRoutes);   // http://localhost:5000/api/payment/...

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`ThemeMatrix backend running on port ${port}`);
});