import { Relationship } from "neo4j-driver";
import { omit } from "radash";

const buildLink = (l: Relationship) => {
  const name = l.properties.name || ""
  return ({
    id: l.elementId,
    extra: {
      data: {
        ...(l.properties || {}),
        label: name,
      }
    },
    source: l.startNodeElementId,
    target: l.endNodeElementId,
    name: name,
    label: name
  });
};

export default buildLink;
