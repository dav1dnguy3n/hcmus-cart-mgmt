const { createClient } = require("redis");

let redisClient = null;

async function connectRedis(redisUrl) {
  if (redisClient) return redisClient;

  const client = createClient({ url: redisUrl });
  client.on("error", (err) => {
    // eslint-disable-next-line no-console
    console.error("Redis client error", err);
  });
  await client.connect();

  redisClient = client;
  return redisClient;
}

async function disconnectRedis() {
  if (!redisClient) return;
  await redisClient.quit();
  redisClient = null;
}

module.exports = { connectRedis, disconnectRedis, getRedisClient: () => redisClient };
