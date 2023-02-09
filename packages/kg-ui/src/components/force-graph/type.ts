import type { ForceNodeType, ForceLinkType } from "kg-model";
import { z } from "zod";

export interface DataType {
  nodes: ForceNodeType[];
  links: ForceLinkType[];
}

export type Props = Partial<DataType> & {};

export type InstanceType = {
  canvasSelection: d3.Selection<HTMLCanvasElement, unknown, null, undefined>;
  simulation: d3.Simulation<d3.SimulationNodeDatum, any>;
};

export const ForceGraphOptions = z
  .object({
    linkStrokeWidth: z.number(), // 线颜色
    linkStrokeOpacity: z.number(),
    linkStrokeColor: z.string(),
    linkStrokeLinecap: z.string(),
    linkSelectColor: z.string(), // 单击或双击时线颜色

    nodeTextColor: z.string(),
    nodeRadius: z.number(),
    nodeArcColor: z.string(), // 单击或双击时外框颜色
  })
  .partial();

export type ForceGraphOptionsType = z.infer<typeof ForceGraphOptions>;

export const defaultForceGraphOptions: Required<ForceGraphOptionsType> = {
  linkStrokeWidth: 1.5,
  linkStrokeOpacity: 1,
  linkStrokeColor: "#999",
  linkStrokeLinecap: "round",
  linkSelectColor: "#F43F5E",

  nodeRadius: 20,
  nodeTextColor: "#444",
  nodeArcColor: "#4ADE80",
};
