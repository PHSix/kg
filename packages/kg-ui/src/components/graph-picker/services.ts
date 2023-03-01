import { request } from "../../utils/request";
import {API, DomainType} from 'kg-model'

// 获取所有领域
export const getDomains = () => {
  return request<API.GetDomains>("/api/domains");
};

// 创建领域
export const postDomain = (body: Pick<DomainType, 'name' | 'description'>) => {
  return request("/api/domain", { method: "POST", body });
};

// 更新领域信息
export const putDomain = (body: any) => {
  return request("/api/domain", { method: "PUT", body });
};

export const deleteDomain= () => {

}
