import { INode } from "@bixi-design/graphs";
import request from "../utils/request";

/**
 * 获取节点和所有节点
 */
export const getNode = (graph: string, nodeId?: string) => {
  return request({
    url: nodeId ? `/api/graph/node/get/${nodeId}` : "/api/graph/node/get",
    params: {
      graph,
    },
    method: "GET",
  });
};

export const createNode = (graph: string, payload: {
  name: string
  group: string
}) => {
  return request({
    url: `/api/graph/node`,
    method: "POST",
    params: { graph },
    data: payload,
  });
};

export const deleteNode = (graph: string, nodeId: string) => {
  return request({
    url: `/api/graph/node/${nodeId}`,
    method: "DELETE",
    params: { graph },
  });
};

export const updateNode = (graph: string, payload: { name: string, group: string }) => {
  const data = {
    ...payload,
  };
  return request({
    url: `/api/graph/node`,
    method: "PUT",
    params: { graph },
    data,
  });
};

/*
 * 获取节点的所有组
 * */
export const getNodeGroups = (graph: string) => {
  return request({
    url: "/api/graph/node/group",
    params: {
      graph,
    },
    method: "GET",
  });
};

/**
 * 新增节点组
 */
export const createGroup = (graph: string, group: string) => {
  return request({
    url: "/api/graph/node/group",
    params: {
      graph,
    },
    method: "POST",
    data: {
      group,
    },
  });
};
