import * as d3 from "d3";
import type { ForceNodeType, ForceLinkType } from "kg-model";
import type { InstanceType, ForceGraphOptionsType } from "./type";
import { BaseForce } from "./baseForce";
import { forceDrag } from "./baseBehaviors";
import { ForceHandler } from "./forceHandler";

export class ForceSvg extends BaseForce {
  public handler = new ForceHandler();

  // @ts-ignore
  private simulation: InstanceType["simulation"];
  private forceLink: d3.ForceLink<d3.SimulationNodeDatum, any> = null!;
  private svg?: d3.Selection<SVGSVGElement, unknown, null, undefined>;

  private marker?: d3.Selection<SVGSVGElement, any, any, any>
  private link?: d3.Selection<d3.BaseType, any, any, any>;
  private node?: d3.Selection<d3.BaseType, any, any, any>;
  private linkText?: d3.Selection<d3.BaseType, any, any, any>;
  private nodeText?: d3.Selection<d3.BaseType, any, any, any>;

  constructor(data: any, options: ForceGraphOptionsType) {
    super(data, options);

    this.prepare();
  }

  /*
   * 预准备，建立模拟力模型
   * */
  private prepare() {
    this.simulation = d3.forceSimulation(this.nodes) as any;
    this.simulation.stop();
    const N = d3.map(this.nodes, (d) => d.id);
    this.forceLink = d3.forceLink(this.links).id(({ index: i }: any) => N[i]);
    this.simulation = this.simulation
      .force("link", this.forceLink.distance(200))
      .force("charge", d3.forceManyBody().strength(-600))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    this.simulation.on("tick", this.ticked);

    this.simulation.restart();
  }

  public mountContainer(selector: string | HTMLElement) {
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

    this.svg
      .call(
        d3
          .zoom()
          .extent([
            [0, 0],
            [width, height],
          ])
          .scaleExtent([0.5, 8])
          .on("zoom", this.zoomed) as any
      )
      .on("dblclick.zoom", null);

    this._gEles();
    this._eventBind();
    this._bindEleBehavior();
  }

  private destory() {
    this.node?.remove();
    this.nodeText?.remove();
    this.link?.remove();
    this.linkText?.remove();
    ['node', 'nodeText', 'link', 'linkText'].map(attr => {
      ((this as any)[attr]) = undefined
    })
  }

  public refresh() {
    this.simulation.nodes(this.nodes);
    this.forceLink.links(this.links);
    this._gEles();
    this._eventBind();
    this._bindEleBehavior();
  }

  public update(nodes: ForceNodeType[], links: ForceLinkType[]) {
    if (this.nodes !== nodes || links !== this.links) {
      this.nodes = nodes;
      this.links = links;
      this.refresh();
    }
  }

  public umount() {
    this.svg?.remove();
    this.simulation.stop();
  }

  private zoomed = (ev: any) => {
    this.svg?.selectAll("g").attr("transform", ev.transform);
  };

  /*
   * refresh render method.
   * */
  private ticked = () => {
    this.link &&
      this.link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

    this.node &&
      this.node
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .style("stroke", this.options.nodeSelectColor);

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
    this.node?.call(forceDrag(this.simulation) as any);
  }

  /*
   * bind click and double click event.
   * */
  private _eventBind() {
    const that = this;
    this.node?.on("click", function (ev: any, d: any) {
      that.handler.emit("nodeClick", d, ev);

      that.node?.style("stroke-width", 0);
      d3.select(this).style("stroke-width", 4);
    });

    this.node?.on("dblclick", function (ev: any, d: any) {
      that.handler.emit("nodeDoubleClick", d, ev);

      that.node?.style("stroke-width", 0);
      // d3.select(this)
    });
  }

  private _gEles() {
    if (this.svg) {
      this.link?.remove();
      this.node?.remove();
      this.nodeText?.remove();
      this.linkText?.remove();

      this.marker = this.gMarker(this.svg) as any
      this.link = this.gLink(this.svg);
      this.link.attr("marker-end", "url(#resolved)");
      this.node = this.gNode(this.svg);
      this.nodeText = this.gNodeText(this.svg);
      this.linkText = this.gLinkText(this.svg);
    }
  }
}
