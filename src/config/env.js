const required = (key, fallback = undefined) => {
  const v = process.env[key] ?? fallback;
  if (v === undefined || v === "") {
    throw new Error(`Missing required env var: ${key}`);
  }
  return v;
};

function splitCsv(value) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function loadEnv() {
  return {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: Number(process.env.PORT ?? 3000),

    mongoUri: required("MONGO_URI"),
    redisUrl: required("REDIS_URL"),

    cassandra: {
      contactPoints: splitCsv(required("CASSANDRA_CONTACT_POINTS")),
      localDataCenter: required("CASSANDRA_LOCAL_DATACENTER"),
      keyspace: required("CASSANDRA_KEYSPACE"),
    },

    neo4j: {
      uri: required("NEO4J_URI"),
      user: required("NEO4J_USER"),
      password: required("NEO4J_PASSWORD"),
    },
  };
}

module.exports = { loadEnv };
