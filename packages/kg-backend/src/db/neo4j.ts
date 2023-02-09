import { driver, auth, session, Session } from "neo4j-driver";

const NEO4J_URL = "neo4j://localhost";

const driverInstance = driver(NEO4J_URL, auth.basic("neo4j", "neo4jDatabase"));

var sessionInstance: Session

function getNeo4jSession(): Session {
  if (!sessionInstance) {
    sessionInstance = driverInstance.session({ database: "kg" });
  }
  return sessionInstance
  // return [sessionInstance];
}

export { getNeo4jSession };
