import request from "../utils/request";

export const deleteLink = (
  linkId: string,
  payload: {
    from: string;
    to: string;
    graph: string;
  }
) => {
  return request({
    url: `/api/graph/link/delete`,
    method: "POST",
    data: {
      ...payload,
      id: linkId,
    },
  });
};

export const updateLink = (
  id: string,
  payload: { name: string; from: string; to: string; graph: string, id: string }
) => {
  const data = {
    // @ts-ignore
    id,
    ...payload,
  };
  return request({
    url: `/api/graph/link/${id}`,
    method: "PUT",
    data,
  });
};

export const createLink = (
  graph: string,
  payload: { from: string; to: string; name: string }
) => {
  return request({
    url: `/api/graph/link`,
    method: "POST",
    params: { graph },
    data: payload,
  });
};
