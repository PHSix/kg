import { useEffect, useMemo } from "react";
import type { InstanceType, DataType } from "../type";
import * as d3 from "d3";
import { ForceNodeType } from "kg-model";

const defaultNodes = [
  {
    x: 313,
    y: 244,
    properies: {
      title: "first title",
    },
  },
  {
    x: 116,
    y: 263,
    properies: {
      title: "second title",
    },
  },
];

export const useWatchData = (instance: InstanceType, data: DataType) => {
  const forceLinks = useMemo(() => {
    return d3.forceLink([]);
  }, [data.links]);

  const nodes = useMemo(() => {
    if (data.nodes.length > 0) {
      return data.nodes;
    }
    return defaultNodes as ForceNodeType[];
  }, [data.nodes]);

  useEffect(() => {
    if (!instance) return;
    const { simulation, canvasSelection } = instance;
    const canvas = canvasSelection.node();
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    simulation.on("tick", () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "black";
      nodes.forEach((node) => {
        context.beginPath();
        context.arc(node.x, node.y, 16, 0, 2 * Math.PI);
        context.fill();
      });
    });
    simulation.restart();
  }, [forceLinks, nodes, instance]);
};
