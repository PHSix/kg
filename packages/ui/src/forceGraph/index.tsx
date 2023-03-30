import { ForceLinkType, ForceNodeType } from "@model";
import { FC, useEffect, useRef } from "react";
import * as d3 from "d3";
import styles from "./styles.module.scss";
import Nodes from "./Nodes";
import Links from "./Links";
import NodeLabels from "./NodeLabels";

const ForceGraph: FC<{
  nodes: ForceNodeType[];
  links: ForceLinkType[];
}> = ({ nodes, links }) => {
  const simulationRef = useRef(d3.forceSimulation());
  const svgRef = useRef<SVGSVGElement>(null);
  const ticked = () => {
    const node = d3.selectAll(".force-node");
    const link = d3.selectAll(".force-link");
    const nodeLabel = d3.selectAll(".force-node-label");
    link
      .attr("x1", function (d: any) {
        return d.source.x;
      })
      .attr("y1", function (d: any) {
        return d.source.y;
      })
      .attr("x2", function (d: any) {
        return d.target.x;
      })
      .attr("y2", function (d: any) {
        return d.target.y;
      });

    node
      .attr("cx", function (d: any) {
        return d.x;
      })
      .attr("cy", function (d: any) {
        return d.y;
      });

    nodeLabel.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y);
  };
  const updateState = () => {
    const simulation = simulationRef.current;
    // const N = d3.map(nodes, (d) => d.id);

    const forceLinks = d3.forceLink(links).id(({ id }: any) => id);

    simulation.nodes(nodes);
    simulation.stop();
    simulation.force("link", forceLinks);

    simulation.on("tick", ticked);
    simulation.restart();
  };

  useEffect(() => {
    // bind zoomed
    if (!svgRef.current) {
      console.error("can't get svg dom node in useLayoutEffect");
      return;
    }

    const simulation = simulationRef.current;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    simulation
      .force("charge", d3.forceManyBody().strength(-700))
      .force("x", d3.forceX())
      .force("y", d3.forceY());
    // .force('center', d3.forceCenter(width / 2, height / 2))
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [-width / 2, -height / 2, width, height]);
    const zoomed = (ev: any) => {
      svg.selectAll("g").attr("transform", ev.transform);
    };

    svg
      .call(
        d3
          .zoom()
          .extent([
            [0, 0],
            [width, height],
          ])
          .scaleExtent([0.5, 8])
          .on("zoom", zoomed) as any
      )
      .on("dblclick.zoom", null);
  }, []);

  // 监听更新数据的时候调用这个接口
  useEffect(() => {
    updateState();
  }, [nodes, links]);


  return (
    <div className={styles.forceWrapper}>
      <svg ref={svgRef} className={styles.svgContainer}>
        <Links data={links}></Links>
        <Nodes simulation={simulationRef.current} data={nodes}></Nodes>
        <NodeLabels data={nodes} />
      </svg>
    </div>
  );
};

export default ForceGraph;
