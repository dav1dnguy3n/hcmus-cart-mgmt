require("dotenv/config");

const { loadEnv } = require("../src/config/env");
const { connectMongo, disconnectMongo } = require("../src/db/mongo");

async function main() {
  const env = loadEnv();
  await connectMongo(env.mongoUri);

  // Add your Mongo seed logic here (restaurants, menus, customers, etc.)
  // eslint-disable-next-line no-console
  console.log("Mongo seed placeholder: OK");

  await disconnectMongo();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

