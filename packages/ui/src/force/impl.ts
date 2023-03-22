import * as d3 from "d3";
import styles from "./index.module.scss";
import { forceDrag, takeData, takeInstances } from "./helper";
import { ForceLinkType, ForceNodeType, ForceNodeRuntimeType } from "@model";

class ForceImpl {
  private instances = takeInstances();
  private _data = takeData();
  private selectNode?: ForceNodeRuntimeType;

  get nodes() {
    return this._data.nodes;
  }

  get link() {
    return this._data.links;
  }

  constructor() {
    let simulation = d3.forceSimulation(this._data.nodes);
    simulation.stop();
    const N = d3.map(this._data.nodes, (d) => d.id);
    const forceLink = d3
      .forceLink(this._data.links)
      .id(({ index: i }: any) => N[i]);
    simulation = simulation
      .force("link", forceLink.distance(200))
      .force("charge", d3.forceManyBody().strength(-1000))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2));

    this.instances = {
      ...this.instances,
      forceLink: forceLink,
      simulation: simulation as any,
    };

    simulation.on("tick", this.ticked);

    simulation.restart();
  }

  mount(containerNode: string | HTMLElement) {
    let _node: HTMLElement;
    if (typeof containerNode === "string") {
      // @ts-ignore
      _node = document.querySelector(containerNode);
      if (!_node) {
        return;
      }
    } else {
      _node = containerNode;
    }

    if (_node.children.length > 0) {
      throw Error("render node have children");
    }
    const width = _node.clientWidth;
    const height = _node.clientHeight;

    const svg = d3.select(_node).append("svg");
    svg.attr("class", styles.svg)
    // svg.style("height", "100%").style("width", "100%");

    const zoomed = (ev: any) => {
      this.instances.svg?.selectAll("g").attr("transform", ev.transform);
    };

    svg
      .call(
        d3
          .zoom()
          .extent([
            [0, 0],
            [width, height],
          ])
          .scaleExtent([0.5, 8])
          .on("zoom", zoomed) as any
      )
      .on("dblclick.zoom", null);

    this.instances.svg = svg;
    this.takeSelections();
  }

  umount() {
    this.instances.simulation?.stop();
    this.instances.link?.remove();
    this.instances.node?.remove();
    this.instances.svg?.remove();
  }

  data({
    nodes,
    links,
  }: Partial<{
    nodes: ForceNodeType[];
    links: ForceLinkType[];
  }>) {
    if (nodes) {
      this._data.nodes = nodes;
    }
    if (links) {
      this._data.links = links;
    }

    if (nodes || links) this.refresh();
  }

  private ticked = () => {
    (this.instances.link as any)
      ?.attr("x1", (d: any) => d.source.x)
      .attr("y1", (d: any) => d.source.y)
      .attr("x2", (d: any) => d.target.x)
      .attr("y2", (d: any) => d.target.y);
    (this.instances.node as any)
      ?.attr("cx", (d: any) => {
        return d.x;
      })
      .attr("cy", (d: any) => d.y)
      .attr("stroke-width", (d: any) => {
        if (d == this.selectNode) {
          return 1.5;
        }
        return 0;
      });
    // .style("stroke", this.options.nodeSelectColor)

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

  private refresh() {
    this.instances.simulation?.nodes(this._data.nodes);
    const N = d3.map(this._data.nodes, (d) => d.id);
    const forceLink = d3
      .forceLink(this._data.links)
      .id(({ index: i }: any) => N[i]);
    this.instances.simulation?.force("link", forceLink.distance(200));

    this.takeSelections();
  }

  private takeSelections() {
    const svg = this.instances.svg;
    if (!svg) return;
    this.instances.node?.remove();
    this.instances.link?.remove();
    const node = svg
      .append("g")
      .attr("class", styles["nodeGroup"])
      .selectAll("circle")
      .data(this._data.nodes)
      .join("circle")
      .attr("r", 20) // circle radius setting
      .attr("cx", (d: any) => d.x)
      .attr("cy", (d: any) => d.y)
      .attr("stroke-width", 0)
      .attr("fill", (d: any) => {
        if (d.properties && d.properties.color) {
          return d.properties.color;
        }
        const index = d.index;
        const color = d3.schemeCategory10[index % 10];
        return color;
      });

    node.call(forceDrag(this.instances.simulation!) as any);

    node.on("click", (_, d: any) => {
      this.selectNode = d;
    });

    const link = svg
      .append("g")
      .attr("class", styles["linkGroup"])
      .attr("stroke", "#999")
      .attr("stroke-opacity", 1)
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .selectAll("line")
      .data(this._data.links)
      .join("line");

    this.instances = {
      ...this.instances,
      node: node as any,
      link: link as any,
    };
  }
}

export default ForceImpl;
