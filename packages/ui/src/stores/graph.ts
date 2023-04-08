import resso from "resso";
// import { ForceNodeType, ForceLinkType } from "@model";
import { ILink, INode } from "@bixi-design/graphs";
import { getNode } from "../api/node";

const graphStore = resso<{
  graphName: string | null;
  nodes: INode[];
  links: ILink[];
  currentNode: INode | null;
  currentLink: ILink | null;
  pollGraph: (graph?: string) => void;
  isPulling: boolean;
  updateBase: INode | ILink | null;
}>({
  graphName: null,
  nodes: [],
  links: [],
  currentNode: null,
  currentLink: null,
  pollGraph: (graph) => {
    const _graph = graph || graphStore.graphName;
    graphStore.graphName = _graph;
    getNode(_graph!).then(res => {
      graphStore.links = res.data.data.links;
      graphStore.nodes = res.data.data.nodes;
    })
  },
  isPulling: false,
  updateBase: null
});

export default graphStore;
