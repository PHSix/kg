import * as d3 from "d3";

/*
 * 力向图拖拽
 * */
export function forceDrag(simulation: any, zoomRef: { k: number }) {
  const dragstarted = (event: any) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    // const scale = zoomRef.k;
    const scale = 1;
    const fx = event.x;
    const fy = event.y;
    event.subject.fx = fx / scale;
    event.subject.fy = fy / scale;
  };

  const dragged = (event: any) => {
    const scale = zoomRef.k;
    event.subject.x = event.x / scale;
    event.subject.y = event.y / scale;
    event.subject.fx = event.x / scale;
    event.subject.fy = event.y / scale;
  };

  const dragended = (event: any) => {
    if (!event.active) simulation.alphaTarget(0);
    const scale = zoomRef.k;
    // const scale = 1;
    event.subject.x = event.x / scale;
    event.subject.y = event.y / scale;
    event.subject.fx = null;
    event.subject.fy = null;
  };

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}
