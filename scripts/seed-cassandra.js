require("dotenv/config");

const { loadEnv } = require("../src/config/env");
const { connectCassandra, disconnectCassandra } = require("../src/db/cassandra");

async function main() {
  const env = loadEnv();

  const client = await connectCassandra(env.cassandra);

  await client.execute(
    `CREATE KEYSPACE IF NOT EXISTS ${env.cassandra.keyspace} WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}`
  );

  // Add your Cassandra seed logic here (tables + sample events)
  // eslint-disable-next-line no-console
  console.log("Cassandra seed placeholder: OK");

  await disconnectCassandra();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

