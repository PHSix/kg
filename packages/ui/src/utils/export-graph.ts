import { ILink, INode } from "@bixi-design/graphs";

const exportGraph = (nodes: INode[], links: ILink[]) => {
  const idMap = new Map<number, string>();

  nodes.forEach((n) => idMap.set(idMap.size + 1, n.id));
  links.forEach((l) => idMap.set(idMap.size + 1, l.id));
};

export default exportGraph;
