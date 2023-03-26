import resso from "resso";
import { ForceNodeType, ForceLinkType } from "@model";

const domainStore = resso<{
  graphName: string | null;
  nodes: ForceNodeType[];
  links: ForceLinkType[];
}>({
  graphName: "Movie",
  nodes: [],
  links: [],
});

export default domainStore;
