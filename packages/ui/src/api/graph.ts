import request from "../utils/request";

export const addGraph = (data: any) => {
  return request({
    url: "/api/graph",
    method: "POST",
    data,
  });
};

export const bulkCreate = (graph: string, data: any) => {
  return request({
    url: "/api/graph/bulkCreate",
    data,
    params: { graph },
    method: "POST",
  });
};

export const getQuery = (topic: string) => {
  return request({
    url: "/api/extra/query",
    params: { topic },
    method: "GET"
  })
}