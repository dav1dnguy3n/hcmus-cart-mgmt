require("dotenv/config");

const { loadEnv } = require("../src/config/env");
const { connectNeo4j, disconnectNeo4j } = require("../src/db/neo4j");

async function main() {
  const env = loadEnv();
  const driver = connectNeo4j(env.neo4j);

  const session = driver.session();
  try {
    await session.run("RETURN 1 as ok");
  } finally {
    await session.close();
  }

  // Add your Neo4j seed logic here (customers/restaurants graph)
  // eslint-disable-next-line no-console
  console.log("Neo4j seed placeholder: OK");

  await disconnectNeo4j();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

