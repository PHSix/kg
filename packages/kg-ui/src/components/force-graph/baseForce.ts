import { merge } from "lodash-es";
import { defaultForceGraphOptions, ForceGraphOptionsType } from "./type";
import * as d3 from "d3";
import styles from "./index.module.scss";
import {ForceLinkType, ForceNodeType} from "kg-model";

export class BaseForce {
  public options: Required<ForceGraphOptionsType>;
  public nodes: ForceNodeType[];
  public links: ForceLinkType[];

  constructor(data: any, options: ForceGraphOptionsType) {
    this.nodes = data.nodes;
    this.links = data.links;
    this.options = merge(options, defaultForceGraphOptions);
  }

  protected generateLink(svg: d3.Selection<SVGSVGElement, any, any, any>) {
    return svg
      .append("g")
      .attr("class", styles["linkGroup"])
      .attr("stroke", this.options.linkStrokeColor)
      .attr("stroke-opacity", this.options.linkStrokeOpacity)
      .attr("stroke-linecap", this.options.linkStrokeLinecap)
      .attr("stroke-width", this.options.linkStrokeWidth)
      .selectAll("line")
      .data(this.links)
      .join("line")
      .on("click", (ev) => {})
      .attr("stroke", (d) => {
        if (d.properties && d.properties.color) return d.properties.color;
        return "#333";
      });
  }

  protected generateLinkText(svg: d3.Selection<SVGSVGElement, any, any, any>) {
    return svg
      .append("g")
      .attr("class", styles["linkTextGroup"])
      .selectAll("text")
      .data(this.links)
      .join("text")
      .attr("font-family", "Maple Mono NF")

      .attr("class", styles["linkText"])
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .text((d) => {
        if (d.properties && d.properties.title) return d.properties.title;
        return "";
      })
      .attr("fill", (d) => {
        // if (d.properties && d.properties.color) return d.properties.color;
        return "#333";
      });
  }

  protected generateNode(svg: d3.Selection<SVGSVGElement, any, any, any>) {
    return (
      svg
        .append("g")
        .attr("class", styles["nodeGroup"])
        .selectAll("circle")
        .data(this.nodes)
        .join("circle")
        .attr("r", this.options.nodeRadius)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("fill", (d: any) => {
          if (d.properties && d.properties.color) {
            return d.properties.color;
          }
          const index = d.index;
          const color = d3.schemeCategory10[index % 10];
          return color;
        })
    );
  }

  protected generateNodeText(svg: d3.Selection<SVGSVGElement, any, any, any>) {
    return svg
      .append("g")
      .attr("class", styles["nodeTextGroup"])
      .attr("fill", "#444")
      .attr("text-anchor", "middle")
      .attr("stroke-width", 0.5)
      .attr("class", styles["nodeText"])
      .selectAll("text")
      .data(this.nodes)
      .join("text")
      .attr("font-family", "Maple Mono NF")
      .attr("font-size", 12)
      .attr("dy", "2.5em")
      .text((d) => {
        if (d.properties && d.properties.title) return d.properties.title;
        return "";
      });
  }

  // node的外框
  protected generateNodeArc(svg: d3.Selection<SVGSVGElement, any, any, any>) {
    // const lockArc = d3.arc(
    //   
    // ).innerRadius()
    // d3.arc()
    // d3.arc()
    return svg.append("g").attr("class", styles["nodeOutterGroup"]).selectAll("arc").data(this.nodes).join('arc');
  }
}
