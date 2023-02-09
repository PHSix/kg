import { ForceLinkRuntimeType, ForceNodeRuntimeType } from "kg-model";

export class ForceHandler {
  event = {
    nodeClick: (() => {}) as any,
    linkClick: (() => {}) as any,
    nodeDoubleClick: (() => {}) as any,
    linkDoubleClick: (() => {}) as any,
  };

  // 默认事件发生会调用，不会随着event变量的修改而阻止，默认为展现出选中效果
  defaultHandler = {
    nodeClick: () => {},
    linkClick: () => {},
  };

  constructor() {}

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
