import { FC, useContext, useEffect, useMemo } from "react";
import cs from "classnames";
import * as d3 from "d3";
import { ForceNodeType } from "@model";
import styles from "./styles.module.scss";
import { forceContext } from "./Provider";

const RADIUS = 10;

const Nodes: FC<{
  data?: ForceNodeType[];
  simulation: any;
}> = ({ data = [], simulation }) => {
  const groups = useMemo(
    () =>
      data.reduce((m: Map<unknown, number>, { group }) => {
        if (group && !m.has(group)) {
          m.set(group, m.size);
        }
        return m;
      }, new Map()),
    [data]
  );
  const { select } = useContext(forceContext);
  useEffect(() => {
    // const simulation = this.props.simulation;
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
    const node = d3.selectAll(".force-node");
    node.call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any
    );

    node.data(data);
    node.on("click", (_, d: any) => {
      select(d);
    });
  }, [data]);

  return (
    <g className={styles.forceNodesGroup}>
      {data.map((node, index) => {
        const { group } = node;
        const color =
          d3.schemeCategory10[(group ? groups.get(group)! : index) % 10];

        // const color = d3.schemeCategory10[index % 10];
        // console.log(color);
        return (
          <circle
            r={RADIUS}
            key={index}
            stroke="#fff"
            strokeWidth={3}
            fill={color}
            cx={node.x}
            cy={node.y}
            className={cs("force-node", styles.forceNode)}
          ></circle>
        );
      })}
    </g>
  );
};

export default Nodes;
