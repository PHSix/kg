import { record, z } from "zod";

export const Properties = z
  .object({
    title: z.string(),
    description: z.string(),
    color: z.string(),
    group: z.unknown()
  })
  .partial();

export type PropertiesType = z.infer<typeof Properties>;

export const ForceNode = z
  .object({
    x: z.number(),
    y: z.number(),
    fx: z.number().nullable(),
    fy: z.number().nullable(),
    id: z.string(),
    properties: Properties,
    // group: z.unknown(),
  })
  .partial({
    fx: true,
    fy: true,
    x: true,
    y: true,
    properties: true,
    // group: true,
  });

export type ForceNodeType = z.infer<typeof ForceNode>;

// export type ForceNodeRuntimeType = ForceNodeType & Record<string, any>
export interface ForceNodeRuntimeType extends ForceNodeType {
  [key: string]: any;
}

export const ForceLink = z
  .object({
    id: z.string(),
    source: z.number().or(z.string()),
    target: z.number().or(z.string()),
    properties: Properties,
  })
  .partial({
    properties: true,
    id: true
  });

export type ForceLinkType = z.infer<typeof ForceLink>;

// export type ForceLinkRuntimeType = ForceLinkType & Record<string, any>
export interface ForceLinkRuntimeType extends ForceLinkType {
  [key: string]: any;
}
