const cassandra = require("cassandra-driver");

let cassandraClient = null;

async function connectCassandra({ contactPoints, localDataCenter, keyspace }) {
  if (cassandraClient) return cassandraClient;

  const client = new cassandra.Client({
    contactPoints,
    localDataCenter,
    keyspace,
  });

  await client.connect();
  cassandraClient = client;
  return cassandraClient;
}

async function disconnectCassandra() {
  if (!cassandraClient) return;
  await cassandraClient.shutdown();
  cassandraClient = null;
}

module.exports = {
  connectCassandra,
  disconnectCassandra,
  getCassandraClient: () => cassandraClient,
};
