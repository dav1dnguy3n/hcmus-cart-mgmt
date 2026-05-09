const express = require("express");

const { createOrdersService } = require("./orders.service");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const service = createOrdersService(req.app.locals);
    const orders = await service.listOrders();
    res.json({ data: orders });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const service = createOrdersService(req.app.locals);
    const created = await service.createOrder(req.body);
    res.status(201).json({ data: created });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
