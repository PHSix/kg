import { merge } from "lodash-es";
import { defaultForceGraphOptions, ForceGraphOptionsType } from "./type";
import * as d3 from "d3";
import styles from "./index.module.scss";
import { ForceLinkType, ForceNodeType } from "kg-model";

export class BaseForce {
  protected options: Required<ForceGraphOptionsType>;
  public nodes: ForceNodeType[];
  public links: ForceLinkType[];

  constructor(data: any, options: ForceGraphOptionsType) {
    this.nodes = data.nodes;
    this.links = data.links;
    this.options = merge(options, defaultForceGraphOptions);
  }

  protected gLink(svg: d3.Selection<SVGSVGElement, any, any, any>) {
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
      .attr("stroke", (d) => {
        if (d.properties && d.properties.color) return d.properties.color;
        return "#333";
      });
  }

  protected gLinkText(svg: d3.Selection<SVGSVGElement, any, any, any>) {
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

  protected gNode(svg: d3.Selection<SVGSVGElement, any, any, any>) {
    return (
      svg
        .append("g")
        .attr("class", styles["nodeGroup"])
        .selectAll("circle")
        .data(this.nodes)
        .join("circle")
        .attr("r", this.options.nodeRadius)
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y)
        .attr("stroke-width", 0)
        // .attr("stroke", "#E11D48")
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

  protected gNodeText(svg: d3.Selection<SVGSVGElement, any, any, any>) {
    return (
      svg
        .append("g")
        .attr("class", styles["nodeTextGroup"])
        .attr("fill", "#444")
        .attr("text-anchor", "middle")
        .attr("stroke-width", 0.5)
        .attr("class", styles["nodeText"])
        .selectAll("text")
        .data(this.nodes)
        .join("text")
        // .attr("font-family", "Maple Mono NF")
        // .attr("font-size", 12)
        .attr("dy", "2.5em")
        .text((d) => {
          if (d.properties && d.properties.title) return d.properties.title;
          return "";
        })
    );
  }

  protected gMarker(svg: d3.Selection<SVGSVGElement, any, any, any>) {
    //添加一个marker标签来绘制箭头
    return svg
      .append("marker")
      .attr("id", "resolved") //箭头id，用于其他标记进行引用时的url
      .attr("markerUnits", "userSpaceOnUse") //定义标记的坐标系统，userSpaceOnUse表示按照引用的元件来决定，strokeWidth按照用户单位决定
      .attr("viewBox", "0 -5 10 10") //坐标系的区域
      .attr("refX", 30) //箭头坐标
      .attr("refY", 0)
      .attr("markerWidth", 12) //标识的大小
      .attr("markerHeight", 12)
      .attr("orient", "auto") //绘制方向，可设定为：auto（自动确认方向）和 角度值
      .attr("stroke-width", 3) //箭头宽度
      .append("path")
      .attr("d", "M0,-5L10,0L0,5") //绘制箭头，路径为一个三角形，有疑问参考svg的path http://www.runoob.com/svg/svg-path.html
      .attr("fill", "#000000"); //箭头颜色
  }
}
