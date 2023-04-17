import z from 'zod'
export const Domain  = z.object({
  name: z.string(),
  description: z.string(),
  createAt: z.date(),
  updateAt: z.date(),
  graphName: z.string()
})

export type DomainType = z.infer<typeof Domain>

export type ResponseType<T = any> = {
  data: T,
  msg: string;
}

export * from './force'
export * from './apiType'
