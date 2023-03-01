import * as d3 from "d3";
import type { ForceNodeType, ForceLinkType } from "kg-model";
import {
  InstanceType,
  ForceGraphOptionsType,
  defaultForceGraphOptions,
} from "./type";
import { BaseForce } from "./baseForce";
import { forceDrag } from "./baseBehaviors";
import { ForceHandler } from "./forceHandler";
import { merge } from "lodash-es";
import classNames from "classnames";
import styles from "./index.module.scss";

export class ForceCanvas {
  public handler = new ForceHandler();

  nodes: ForceNodeType[];
  links: ForceLinkType[];
  private simulation: InstanceType["simulation"];
  private svg?: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private canvas?: d3.Selection<HTMLCanvasElement, unknown, null, undefined>;

  private link?: d3.Selection<d3.BaseType, any, any, any>;
  private node?: d3.Selection<d3.BaseType, any, any, any>;
  private linkText?: d3.Selection<d3.BaseType, any, any, any>;
  private nodeText?: d3.Selection<d3.BaseType, any, any, any>;
  private options: Required<ForceGraphOptionsType>;

  private zoomScale = { x: 0, y: 0, k: 1 };

  private selectNodeId: number | string | undefined;

  constructor(data: any, options: ForceGraphOptionsType) {
    this.options = merge(defaultForceGraphOptions, options);
    this.nodes = data.nodes;
    this.links = data.links;
    this.simulation = d3.forceSimulation(this.nodes) as any;
    this.simulation.stop();

    this.prepare();
  }

  /*
   * 预准备，建立模拟力模型
   * */
  private prepare() {
    const N = d3.map(this.nodes, (d) => d.id);
    const forceLink = d3.forceLink(this.links).id(({ index: i }: any) => N[i]);
    this.simulation = this.simulation
      .force("link", forceLink.distance(200))
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    this.simulation.on("tick", this.ticked);

    this.simulation.restart();
  }

  mountContainer(selector: string | HTMLElement) {
    const wrapper: d3.Selection<HTMLElement, any, any, any> =
      // @ts-ignore
      d3.select(selector);
    if (!wrapper.node()) return;
    const width = wrapper.node()!.offsetWidth;
    const height = wrapper.node()!.offsetHeight;

    const ratio = window.devicePixelRatio || 1;
    this.canvas = wrapper
      .append("canvas")
      .attr("width", width * ratio)
      .attr("height", height * ratio)
      .attr("class", classNames("force-canvas", styles["canvas"]));

    const context = this.context;
    context.scale(ratio, ratio);

    // context.beginPath()
    // context.moveTo(100, 100)
    // context.arc(100, 100, 20, 0, Math.PI * 2)
    // context.fillStyle = "#22C55E"
    // context.fill()
    // context.strokeStyle = 'none'
    // context.stroke()

    // this.svg = wrapper
    //   .append("svg")
    //   .attr("width", width)
    //   .attr("height", height)
    //   .attr("viewBox", [-width / 2, -height / 2, width, height])
    //   .attr(
    //     "style",
    //     "max-width: 100%; height: auto; height: intrinsic;border: 1px solid #aaa;"
    //   );
    //
    // this.svg
    //   .call(
    //     d3
    //       .zoom()
    //       .extent([
    //         [0, 0],
    //         [width, height],
    //       ])
    //       .scaleExtent([0.5, 8])
    //       .on("zoom", this.zoomed) as any
    //   )
    //   .on("dblclick.zoom", null);
    //
    // this._generateEleSelections();
    // this._eventBind();
    // this._bindEleBehavior();
  }

  update(nodes: ForceNodeType[], links: ForceLinkType[]) {
    if (this.nodes !== nodes || links !== this.links) {
      this.nodes = nodes;
      this.links = links;
      this._generateEleSelections();
      this._eventBind();
      this._bindEleBehavior();
    }
  }

  umount() {
    this.canvas?.remove();
    this.simulation.stop();
    this.canvas = undefined;
  }

  private zoomed = (ev: any) => {
    // zoomScale 通过ref的形式传给了drag函数，所以这里不行直接修改引用
    this.zoomScale.x = ev.transform.x;
    this.zoomScale.y = ev.transform.y;
    this.zoomScale.k = ev.transform.k;

    this.link?.attr("transform", ev.transform);
    this.node?.attr("transform", ev.transform);
    this.nodeText?.attr("transform", ev.transform);
    this.linkText?.attr("transform", ev.transform);
  };
  get context() {
    if (!this.canvas)
      throw Error("canvas was not mount, can't get canvas 2d context");
    const c = this.canvas.node()?.getContext("2d");
    if (!c) throw Error("get canvas 2d context error.");
    return c;
  }

  drawLink(context: CanvasRenderingContext2D, d: any) {
    context.moveTo(d.source.x, d.source.y);
    context.lineTo(d.target.x, d.target.y);
  }

  drawNode(context: CanvasRenderingContext2D, d: any) {
    // context.moveTo(d.x + 3, d.y);
    context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
  }

  private ticked = () => {
    if (!this.canvas) return;
    const context = this.context;
    const width = this.canvas?.node()?.width!;
    const height = this.canvas?.node()?.height!;
    context.clearRect(0, 0, width, height);
    //
    // context.beginPath();
    // for (let i = 0; i < this.links.length; i++) {
    //   this.drawLink(context, this.links[i]);
    // }
    // context.strokeStyle = "#aaaaaa";
    // context.stroke();
    // //
    context.beginPath();
    
    context.arc(this.nodes[0].x, Math.abs(this.nodes[0].y), 20, 0, Math.PI * 2);
    context.fillStyle = "#22C55E";
    context.fill();
    context.strokeStyle = "none";
    // context.beginPath();
    // this.drawNode(context, this.nodes[0])
    // // for (let i = 0; i < this.nodes.length; i++) {
    // //   this.drawNode(context, this.nodes[i]);
    // // }
    // context.fill();
    // context.lineWidth = 3;
    // context.strokeStyle = "#fff";
    // context.stroke();
    //
    // // this.link &&
    //   this.link
    //     .attr("x1", (d) => d.source.x)
    //     .attr("y1", (d) => d.source.y)
    //     .attr("x2", (d) => d.target.x)
    //     .attr("y2", (d) => d.target.y);
    //
    // this.node &&
    //   this.node
    //     .attr("cx", (d) => d.x)
    //     .attr("cy", (d) => d.y)
    //     .attr("stroke-width", (d) => {
    //       if (d.id === this.selectNodeId) return 5;
    //       return 0;
    //     });
    //
    // this.nodeText && this.nodeText.attr("x", (d) => d.x).attr("y", (d) => d.y);
    //
    // this.linkText &&
    //   this.linkText
    //     .attr("x", function (d) {
    //       if (!d.source.x || !d.target.x) return 0;
    //       var x = (parseFloat(d.source.x) + parseFloat(d.target.x)) / 2;
    //       return x;
    //     })
    //     .attr("y", function (d) {
    //       if (!d.source.y || !d.target.y) return 0;
    //       var y = (parseFloat(d.source.y) + parseFloat(d.target.y)) / 2;
    //       return y;
    //     });
  };

  private _bindEleBehavior() {
    this.node?.call(forceDrag(this.simulation, this.zoomScale) as any);
  }

  private _eventBind() {
    this.node?.on("click", (ev: any, d: any) => {
      this.selectNodeId = d.id;
      this.handler.emit("nodeClick", d, ev);
    });

    this.node?.on("dblclick", (ev: any, d: any) => {
      this.selectNodeId = d.id;
      this.handler.emit("nodeDoubleClick", d, ev);
    });
  }

  private _generateEleSelections() {}
}
