import resso from "resso";
// import { ForceNodeType, ForceLinkType } from "@model";
import { ILink, INode } from "@bixi-design/graphs";

const graphStore = resso<{
  graphName: string | null;
  nodes: INode[];
  links: ILink[];
  currentNode: INode | null;
  currentLink: ILink | null;
}>({
  graphName: null,
  nodes: [],
  links: [],
  currentNode: null,
  currentLink: null
});

export default graphStore;
