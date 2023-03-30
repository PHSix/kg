import { FC, useEffect } from "react";
import { ForceNodeType } from "@model";
import cs from "classnames";
import * as d3 from "d3";
import styles from "./styles.module.scss";

const NodeLabels: FC<{
  data: ForceNodeType[];
}> = ({ data }) => {
  useEffect(() => {
    const labels = d3.selectAll(".force-node-label");
    labels.data(data);
  }, [data]);

  return (
    <g className={styles.nodeLabelsGroup}>
      {data.map((node, index) => {
        return (
          <text
            key={index}
            className={cs("force-node-label", styles.forceNodeLabel)}
            fill={"#444"}
            textAnchor="middle"
            strokeWidth={0.5}
            dy="20px"
          >
            {node.id}
          </text>
        );
      })}
    </g>
  );
};

export default NodeLabels;
