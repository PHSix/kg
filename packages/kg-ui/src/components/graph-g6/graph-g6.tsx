import * as g6 from "@antv/g6";
import ReactDOM from "react-dom";
import { useEffect, useRef } from "react";
import styles from "./index.module.scss";

export const GraphG6 = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const graphInstance = useRef<g6.Graph>();

  useEffect(() => {
    if (wrapperRef.current && !graphInstance.current) {
      const graph = new g6.Graph({
        container: wrapperRef.current,
        animate: true,
        layout: {
          type: "force",
        },
        modes: {
          default: [
            "drag-canvas",
            "zoom-canvas",
            {
              type: "drag-node",
            },
          ], // 允许拖拽画布、放缩画布、拖拽节点
        },
      });

      graph.data({
        nodes: [
          {
            id: "node1",
            x: 100,
            y: 200,
          },
          {
            id: "node2",
            x: 300,
            y: 200,
          },
        ],
      });
      graph.render();
      graphInstance.current = graph;
    }

    return () => {
      graphInstance.current?.destroy();
      graphInstance.current = undefined;
    };
  }, []);

  return <div className={styles.wrapper} ref={wrapperRef}></div>;
};
