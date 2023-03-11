import { useEffect } from "react";
import type { InstanceType } from "../type";
import * as d3 from "d3";


function dragBind(simulation: InstanceType["simulation"]) {
  return d3
    .drag()
    .on("start", (event) => {
      if (!event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    })
    .on("drag", (event) => {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    })
    .on("end", (event) => {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    });
}

export const useDragSimulation = (instance?: InstanceType) => {
  useEffect(() => {
    if (!instance) return;
    const behavior = dragBind(instance.simulation);
    instance.canvasSelection.call(behavior as any);
  }, [instance, instance?.simulation, instance?.canvasSelection]);
};
