import * as d3 from "d3";
import type { ForceNodeType, ForceLinkType } from "kg-model";
import type { InstanceType, ForceGraphOptionsType } from "./type";
import { BaseForce } from "./baseForce";
import { forceDrag } from "./baseBehaviors";
import { ForceHandler } from "./forceHandler";

export class ForceClass extends BaseForce {
  public handler = new ForceHandler();

  // nodes: ForceNodeType[];
  // links: ForceLinkType[];
  private simulation: InstanceType["simulation"];
  private svg?: d3.Selection<SVGSVGElement, unknown, null, undefined>;

  private link?: d3.Selection<d3.BaseType, any, any, any>;
  private node?: d3.Selection<d3.BaseType, any, any, any>;
  private linkText?: d3.Selection<d3.BaseType, any, any, any>;
  private nodeText?: d3.Selection<d3.BaseType, any, any, any>;

  private zoomScale = { x: 0, y: 0, k: 1 };

  constructor(data: any, options: ForceGraphOptionsType) {
    super(data, options);
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
      .force("charge", d3.forceManyBody().strength(-600))
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

    this.svg = wrapper
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr(
        "style",
        "max-width: 100%; height: auto; height: intrinsic;border: 1px solid #aaa;"
      );

    this.svg.call(
      d3
        .zoom()
        .extent([
          [0, 0],
          [width, height],
        ])
        .scaleExtent([0.5, 8])
        .on("zoom", this.zoomed) as any
    );

    this._generateEleSelections();
    this._eventBind();
    this._bindEleBehavior();
  }

  update(nodes: ForceNodeType[], links: ForceLinkType[]) {
    this.nodes = nodes;
    this.links = links;
    if (this.nodes !== nodes || links !== this.links) {
      this._generateEleSelections();
      this._eventBind();
      this._bindEleBehavior();
    }
  }

  umount() {
    this.svg?.remove();
    this.simulation.stop();
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

  private ticked = () => {
    this.link &&
      this.link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

    this.node && this.node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    this.nodeText && this.nodeText.attr("x", (d) => d.x).attr("y", (d) => d.y);

    this.linkText &&
      this.linkText
        .attr("x", function (d) {
          if (!d.source.x || !d.target.x) return 0;
          var x = (parseFloat(d.source.x) + parseFloat(d.target.x)) / 2;
          return x;
        })
        .attr("y", function (d) {
          if (!d.source.y || !d.target.y) return 0;
          var y = (parseFloat(d.source.y) + parseFloat(d.target.y)) / 2;
          return y;
        });
  };

  private _bindEleBehavior() {
    this.node?.call(forceDrag(this.simulation, this.zoomScale) as any);
  }

  private _eventBind() {
    this.node?.on("click", (ev: any, data: any) => {});
  }

  private _generateEleSelections() {
    if (this.svg) {
      this.link = this.generateLink(this.svg);

      this.node = this.generateNode(this.svg);

      this.nodeText = this.generateNodeText(this.svg);

      this.linkText = this.generateLinkText(this.svg);
    }
  }
}
