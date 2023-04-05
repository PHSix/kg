import { QueryResult, types } from "neo4j-driver";
import { ForceLinkType, ForceNodeType } from "@model";
import buildNode from "./buildNode";
import buildLink from "./buildLink";
type QueryRecords = QueryResult["records"];

const transform = (records: QueryRecords) => {
  const initial = {
    nodes: [] as any[],
    links: [] as any[],
  }
  const nodeSet = new Set<string>();
  const linkSet = new Set<string>();
  const pushLink = (l: any) => {
    if (!linkSet.has(l.elementId)) {
      linkSet.add(l.elementId);
      initial.links.push(buildLink(l));
    }
  }
  const pushNode = (n: any) => {
    if (!nodeSet.has(n.elementId)) {
      nodeSet.add(n.elementId);
      initial.nodes.push(buildNode(n));
    }
  }
  return records.reduce(
    (store, record) => {
      Object.values(record.toObject()).map(async (v) => {
        if (v instanceof types.Node) {
          pushNode(v)
          // store.nodes.push(buildNode(v));
        } else if (v instanceof types.Relationship) {
          // store.links.push(buildLink(v));
          pushLink(v);

        } else if (v instanceof types.Path) {
          pushNode(v.start)
          pushNode(v.end)

          for (let obj of v.segments) {
            pushNode(obj.start)
            pushNode(obj.end)
            pushLink(obj.relationship)

            // store.links.push(buildLink(obj.relationship));
          }
        } else if (v instanceof Array) {
          for (let obj of v) {
            if (obj instanceof types.Node) {
              pushNode(obj)
              // store.nodes.push(buildNode(obj));
            } else if (obj instanceof types.Relationship) {
              pushLink(obj)
              // store.links.push(buildLink(obj));
            }
          }
        }
      });

      return store;
    },
    initial
  );
};

export default transform;
