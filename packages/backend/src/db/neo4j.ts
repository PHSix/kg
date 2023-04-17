import { driver, auth, ServerInfo, Session } from "neo4j-driver";

const NEO4J_URL = "neo4j://localhost";

const neo4j = driver(NEO4J_URL, auth.basic("neo4j", "neo4jDatabase"));
let serverInfo: ServerInfo;

const neo4jInitial = async () => {
  serverInfo = await neo4j.getServerInfo();
};
export { neo4jInitial, neo4j, serverInfo };
