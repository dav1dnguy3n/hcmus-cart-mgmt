require("dotenv/config");

const express = require("express");
const cors = require("cors");

const { loadEnv } = require("./config/env");
const { connectMongo, disconnectMongo } = require("./db/mongo");
const { connectRedis, disconnectRedis } = require("./db/redis");
const { connectCassandra, disconnectCassandra } = require("./db/cassandra");
const { connectNeo4j, disconnectNeo4j } = require("./db/neo4j");
const routes = require("./routes");

async function bootstrap() {
  const env = loadEnv();

  const app = express();
  app.locals.env = env;

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  await connectMongo(env.mongoUri);
  app.locals.redis = await connectRedis(env.redisUrl);
  app.locals.cassandra = await connectCassandra(env.cassandra);
  app.locals.neo4j = connectNeo4j(env.neo4j);

  app.use("/api", routes);

  app.use((err, req, res, next) => {
    const status = Number(err.statusCode ?? 500);
    res.status(status).json({
      error: {
        message: err.message ?? "Internal Server Error",
      },
    });
  });

  const server = app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${env.port}/api`);
  });

  async function shutdown() {
    server.close();
    await Promise.allSettled([
      disconnectNeo4j(),
      disconnectCassandra(),
      disconnectRedis(),
      disconnectMongo(),
    ]);
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

