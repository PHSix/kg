export interface Domain {
  name: string,
  description: string,
  createAt: Date,
  updateAt: Date,
  graphName: string,
}

export type ResponseType<T = any> = {
  data: T,
  msg: string;
}

export * from './force'
export * from './apiType'
