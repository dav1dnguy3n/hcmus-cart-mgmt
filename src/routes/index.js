const express = require("express");

const healthRouter = require("./health");
const ordersRouter = require("../modules/orders/orders.routes");

const router = express.Router();

router.use("/health", healthRouter);
router.use("/orders", ordersRouter);

module.exports = router;
