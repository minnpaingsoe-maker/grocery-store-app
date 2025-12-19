const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

router.get("/", productController.getAll);

router.post("/", auth, adminOnly, productController.create);

router.put("/:id", auth, adminOnly, productController.update);

router.delete("/:id", auth, adminOnly, productController.remove);

module.exports = router;
