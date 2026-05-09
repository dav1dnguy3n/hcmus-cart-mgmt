const crypto = require("node:crypto");

const { listOrdersMongo, createOrderMongo } = require("./repository/orders.mongo");
const { writeOrderEvent, ensureOrdersTables } = require("./repository/orders.cassandra");
const { ensureOrderGraphConstraints, upsertOrderRelations } = require("./repository/orders.neo4j");

function createOrdersService(appLocals) {
  const { cassandra, neo4j, env } = appLocals;

  return {
    async listOrders() {
      return await listOrdersMongo();
    },

    async createOrder(payload) {
      const orderId = crypto.randomUUID();

      const normalized = {
        customerId: String(payload.customerId ?? ""),
        restaurantId: String(payload.restaurantId ?? ""),
        items: Array.isArray(payload.items) ? payload.items : [],
        total: Number(payload.total ?? 0),
        status: "created",
      };

      if (!normalized.customerId || !normalized.restaurantId) {
        const err = new Error("customerId and restaurantId are required");
        err.statusCode = 400;
        throw err;
      }

      const created = await createOrderMongo({ _id: orderId, ...normalized });

      if (cassandra) {
        await ensureOrdersTables(cassandra, env.cassandra.keyspace);
        await writeOrderEvent(cassandra, {
          orderId,
          eventType: "ORDER_CREATED",
          payload: { total: normalized.total },
        });
      }

      if (neo4j) {
        await ensureOrderGraphConstraints(neo4j);
        await upsertOrderRelations(neo4j, {
          orderId,
          customerId: normalized.customerId,
          restaurantId: normalized.restaurantId,
        });
      }

      return created;
    },
  };
}

module.exports = { createOrdersService };
