import request from "../utils/request";

export const addGraph = (data: any) => {
  return request({
    url: "/api/graph",
    method: "POST",
    data,
  });
};

export const uploadGraph = (graph: string, data: any) => {
  return request({
    url: "/api/graph/bulkCreate",
    data,
    params: { graph },
    method: "POST",
  });
};
