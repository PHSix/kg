import { ForceLinkRuntimeType, ForceNodeRuntimeType } from "kg-model";

/*
 * handle force graph native dom event.
 * */
export class ForceHandler {
  event = {
    nodeClick: ((nodeData: ForceNodeRuntimeType, ev: MouseEvent) => {
      nodeData.focus = !nodeData.focus
    }) as any,
    linkClick: (() => {}) as any,
    nodeDoubleClick: (() => {}) as any,
    linkDoubleClick: (() => {}) as any,
  };

  constructor() {}

  emit(ev: "nodeClick" | "nodeDoubleClick", d: any, sourceEv: MouseEvent ) {
    if (ev === "nodeClick") {
      this.event.nodeClick(d, sourceEv)
    }else if (ev === "nodeDoubleClick") {
      this.event.nodeDoubleClick(d, sourceEv)
    }
  }

  onNodeClick(fn: (nodeData: ForceNodeRuntimeType, ev: MouseEvent) => unknown) {
    this.event.nodeClick = fn;
  }

  onLinkClick(fn: (linkData: ForceLinkRuntimeType, ev: MouseEvent) => unknown) {
    this.event.linkClick = fn;
  }

  onNodeDoubleClick(
    fn: (nodeData: ForceNodeRuntimeType, ev: MouseEvent) => unknown
  ) {
    this.event.nodeDoubleClick = fn;
  }

  onLinkDoubleClick(
    fn: (linkData: ForceLinkRuntimeType, ev: MouseEvent) => unknown
  ) {
    this.event.linkDoubleClick = fn;
  }
}
