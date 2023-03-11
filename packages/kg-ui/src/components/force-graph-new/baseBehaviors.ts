import * as d3 from "d3";

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
    event.subject.x = event.x ;
    event.subject.y = event.y ;
    event.subject.fx = event.x ;
    event.subject.fy = event.y ;
  };

  const dragended = (event: any) => {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.x = event.x ;
    event.subject.y = event.y ;
    event.subject.fx = null;
    event.subject.fy = null;
  };

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}
