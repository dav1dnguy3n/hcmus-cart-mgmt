async function ensureOrdersTables(client, keyspace) {
  const ks = keyspace;

  await client.execute(
    `CREATE KEYSPACE IF NOT EXISTS ${ks} WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}`
  );

  await client.execute(
    `CREATE TABLE IF NOT EXISTS ${ks}.order_events (
      order_id text,
      event_time timestamp,
      event_type text,
      payload text,
      PRIMARY KEY (order_id, event_time)
    ) WITH CLUSTERING ORDER BY (event_time DESC)`
  );
}

async function writeOrderEvent(client, { orderId, eventType, payload }) {
  const query =
    "INSERT INTO order_events (order_id, event_time, event_type, payload) VALUES (?, toTimestamp(now()), ?, ?)";
  const params = [orderId, eventType, JSON.stringify(payload ?? {})];
  await client.execute(query, params, { prepare: true });
}

module.exports = { ensureOrdersTables, writeOrderEvent };
