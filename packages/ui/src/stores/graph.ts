import resso from "resso";
// import { ForceNodeType, ForceLinkType } from "@model";
import { getNode } from "../api/node";
import { ILink, INode } from "../utils/type";

const graphStore = resso<{
  graphName: string | null;
  nodes: INode[];
  links: ILink[];
  currentBase: INode | ILink | null;
  pollGraph: (graph?: string, abortController?: AbortController) => void;
  isPulling: boolean;
  updateBase: INode | ILink | null;
  lockedNode: INode | null;
  searchNodeId: string | null;
  direction: "both" | "in" | "out";
}>({
  graphName: null,
  nodes: [],
  links: [],
  currentBase: null,
  direction: "both",
  pollGraph: (graph, ab) => {
    const _graph = graph || graphStore.graphName;
    if (_graph === graph) {
      graphStore.searchNodeId = null
    }
    graphStore.graphName = _graph;
    getNode(_graph!, graphStore.searchNodeId, graphStore.direction, ab).then((res) => {
      graphStore.links = res.data.data.links;
      graphStore.nodes = res.data.data.nodes;
    });
  },
  isPulling: false,
  updateBase: null,
  lockedNode: null,
  searchNodeId: null,
});

export default graphStore;
