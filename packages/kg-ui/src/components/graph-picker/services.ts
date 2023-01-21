import { request } from "../../utils/request";
import {API} from 'models/apiType'
import {Domain} from "models";

// 获取所有领域
export const getDomains = () => {
  return request<API.GetDomains>("/api/domains");
};

// 创建领域
export const postDomain = (body: Pick<Domain, 'name' | 'description'>) => {
  return request("/api/domain", { method: "POST", body });
};

// 更新领域信息
export const putDomain = (body: any) => {
  return request("/api/domain", { method: "PUT", body });
};

export const deleteDomain= () => {

}
