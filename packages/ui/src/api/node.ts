import request from "../utils/request";

/**
 * 获取节点和所有节点
 */
export const getNode = (graph: string, nodeId?: string) => {
    return request({
        url: nodeId ? `/api/graph/node/get/${nodeId}` : "/api/graph/node/get",
        params: {
            graph
        },
        method: "GET"
    })
}