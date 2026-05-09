const neo4j = require("neo4j-driver");

let neo4jDriver = null;

function connectNeo4j({ uri, user, password }) {
  if (neo4jDriver) return neo4jDriver;

  neo4jDriver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  return neo4jDriver;
}

async function disconnectNeo4j() {
  if (!neo4jDriver) return;
  await neo4jDriver.close();
  neo4jDriver = null;
}

module.exports = { connectNeo4j, disconnectNeo4j, getNeo4jDriver: () => neo4jDriver };
