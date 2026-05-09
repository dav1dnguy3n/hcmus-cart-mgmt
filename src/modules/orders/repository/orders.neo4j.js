async function ensureOrderGraphConstraints(driver) {
  const session = driver.session();
  try {
    await session.run("CREATE CONSTRAINT order_id IF NOT EXISTS FOR (o:Order) REQUIRE o.id IS UNIQUE");
    await session.run("CREATE CONSTRAINT customer_id IF NOT EXISTS FOR (c:Customer) REQUIRE c.id IS UNIQUE");
    await session.run("CREATE CONSTRAINT restaurant_id IF NOT EXISTS FOR (r:Restaurant) REQUIRE r.id IS UNIQUE");
  } finally {
    await session.close();
  }
}

async function upsertOrderRelations(driver, { orderId, customerId, restaurantId }) {
  const session = driver.session();
  try {
    await session.run(
      `
      MERGE (c:Customer {id: $customerId})
      MERGE (r:Restaurant {id: $restaurantId})
      MERGE (o:Order {id: $orderId})
      MERGE (c)-[:PLACED]->(o)
      MERGE (o)-[:FROM]->(r)
      `,
      { orderId, customerId, restaurantId }
    );
  } finally {
    await session.close();
  }
}

module.exports = { ensureOrderGraphConstraints, upsertOrderRelations };
