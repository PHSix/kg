import request from "../utils/request";

export const addGraph = (data: any) => {
  return request({
    url: "/api/graph",
    method: "POST",
    data,
  });
};
