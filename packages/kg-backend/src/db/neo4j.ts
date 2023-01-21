import { driver, auth, session, Session } from "neo4j-driver";

const NEO4J_URL = "neo4j://localhost";

const driverInstance = driver(NEO4J_URL, auth.basic("neo4j", "neo4jDatabase"));

function getNeo4jSession(): [Session] {
  const sessionInstance = driverInstance.session({ database: "kg" });
  return [sessionInstance];
}

export { getNeo4jSession };
