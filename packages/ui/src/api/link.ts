import { ILink } from "@bixi-design/graphs";
import request from "../utils/request";

export const deleteLink = (graph: string, linkId: string) => {
  return request({
    url: `/api/graph/link/${linkId}`,
    method: "DELETE",
    params: { graph },
  });
};

export const updateLink = (graph: string, payload: { name: string }) => {
  const data = {
    ...payload
  };
  return request({
    url: `/api/graph/link`,
    method: "PUT",
    params: { graph },
    data,
  });
};
