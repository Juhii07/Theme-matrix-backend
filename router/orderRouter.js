// // const express = require("express");
// // const router = express.Router();

// // const orderController = require("../controller/order/orderController");

// // // http://localhost:5000/orderapi/orders
// // router.get("/order", orderController.getorders);

// // module.exports = router;


// const express         = require("express");
// const router          = express.Router();
// const orderController = require("../controller/user/orderController");
// const userAuth        = require("../controller/middleware/userAuth");

// // ─── USER ORDER ROUTES ────────────────────────────────────────────────
// // POST   http://localhost:5000/api/user/place-order        → Place new order (clears cart)
// router.post("/user/place-order",  userAuth, orderController.placeOrder);

// // GET    http://localhost:5000/api/user/my-orders          → Get all orders of logged in user
// router.get("/user/my-orders",     userAuth, orderController.getMyOrders);

// // GET    http://localhost:5000/api/user/orders/:id         → Get single order by ID
// router.get("/user/orders/:id",    userAuth, orderController.getSingleOrder);

// module.exports = router;







// const express         = require("express");
// const router          = express.Router();
// const orderController = require("../controller/user/orderController");
// const userAuth        = require("../controller/middleware/userAuth");

// // POST http://localhost:5000/api/user/place-order
// router.post("/user/place-order",  userAuth, orderController.placeOrder);

// // GET  http://localhost:5000/api/user/my-orders
// router.get("/my-orders", userAuth, orderController.getMyOrders)

// // GET  http://localhost:5000/api/user/orders/:id
// router.get("/user/orders/:id",    userAuth, orderController.getSingleOrder);

// module.exports = router;







// const express         = require("express");
// const router          = express.Router();
// const orderController = require("../controller/user/orderController");
// const userAuth        = require("../controller/middleware/userAuth");

// // POST http://localhost:5000/api/user/place-order
// router.post("/user/place-order",  userAuth, orderController.placeOrder);

// // GET  http://localhost:5000/api/user/my-orders
// router.get("/user/my-orders",     userAuth, orderController.getMyOrders);

// // GET  http://localhost:5000/api/user/orders/:id
// router.get("/user/orders/:id",    userAuth, orderController.getSingleOrder);

// module.exports = router;





const express         = require("express");
const router          = express.Router();
const orderController = require("../controller/user/orderController");
const userController  = require("../controller/user/userController");
const userAuth        = require("../controller/middleware/userAuth");

// ─── USER PROFILE ROUTES (under /api) ─────────────────────────────────
// GET  http://localhost:5000/api/user/me
router.get("/user/me",                  userAuth, userController.getMe);

// PUT  http://localhost:5000/api/user/update/:id
router.put("/user/update/:id",          userAuth, userController.updateUser);

// POST http://localhost:5000/api/user/change-password/:id
router.post("/user/change-password/:id", userAuth, userController.changePassword);

// ─── ORDER ROUTES ──────────────────────────────────────────────────────
// POST http://localhost:5000/api/user/place-order
router.post("/user/place-order",  userAuth, orderController.placeOrder);

// GET  http://localhost:5000/api/user/my-orders
router.get("/user/my-orders",     userAuth, orderController.getMyOrders);

// GET  http://localhost:5000/api/user/orders/:id
router.get("/user/orders/:id",    userAuth, orderController.getSingleOrder);

module.exports = router;