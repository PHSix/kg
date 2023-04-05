import { Node } from "neo4j-driver";
import { omit } from "radash";

const buildNode = (n: Node) => {
  const name = n.properties.name || ""
  return {
    id: n.elementId,
    name: name,
    label: name,
    schema_name: n.properties.group,
    extra: { data: { ...(omit(n.properties, ['group']) || {}), label: name } }
  }
};

export default buildNode;
