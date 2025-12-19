const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const orderController = require("../controllers/orderController");

// Admin only: get all orders
router.get("/", auth, orderController.getAllOrders);

router.get("/my-orders", auth, orderController.getUserOrders);

router.post("/checkout", auth, orderController.createOrder);

module.exports = router;
