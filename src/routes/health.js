const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ ok: true, service: "hcmus-cart-mgmt" });
});

module.exports = router;
