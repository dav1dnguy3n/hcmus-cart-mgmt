const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true },
    restaurantId: { type: String, required: true },
    items: [
      {
        itemId: { type: String, required: true },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    status: { type: String, required: true, default: "created" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

async function listOrdersMongo() {
  return await Order.find({}).sort({ createdAt: -1 }).lean();
}

async function createOrderMongo(payload) {
  const created = await Order.create(payload);
  return created.toObject();
}

module.exports = { listOrdersMongo, createOrderMongo };
