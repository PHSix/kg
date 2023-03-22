import * as d3 from "d3";
import type { ForceNodeType, ForceLinkType } from "@model";

type Selection<T = d3.BaseType> = T extends d3.BaseType
  ? d3.Selection<T, any, any, any>
  : never;

type Simulation = d3.Simulation<d3.SimulationNodeDatum, any>;

type ForceLink = d3.ForceLink<d3.SimulationNodeDatum, any>;

type Instances = Partial<{
  svg: Selection<SVGSVGElement>;
  simulation: Simulation;
  forceLink: ForceLink;
  node: Selection;
  link: Selection;
  marker: Selection<SVGSVGElement>;
}>;

export function takeInstances(): Instances {
  const _instances: Instances = {};

  return _instances;
}

export function takeData(): {
  nodes: ForceNodeType[];
  links: ForceLinkType[];
} {
  return {
    nodes: [
      {
        id: "first Node",
        properties: {
          title: "NODE 1",
          color: "#A855F7",
        },
      },
      {
        id: "Second Node",
        properties: {
          title: "NODE 2",
        },
      },
    ],
    links: [
      {
        source: "first Node",
        target: "Second Node",
        properties: {
          color: "#22C55E",
          title: "relationship 1",
        },
      },
    ],
  };
}

/*
 * 力向图拖拽
 * */
export function forceDrag(simulation: any) {
  const dragstarted = (event: any) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    const fx = event.x;
    const fy = event.y;
    event.subject.fx = fx;
    event.subject.fy = fy;
    // prevent event popup, because event popup will emit the dragged callback of zoom behavior.
    event.sourceEvent.stopPropagation();
  };

  const dragged = (event: any) => {
    event.subject.x = event.x;
    event.subject.y = event.y;
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  };

  const dragended = (event: any) => {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.x = event.x;
    event.subject.y = event.y;
    event.subject.fx = null;
    event.subject.fy = null;
  };

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}
