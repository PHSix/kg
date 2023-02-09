import {message} from "antd";
import { assignIn, cloneDeep, omit } from "lodash-es";
import { ResponseType } from "kg-model";

interface RequestOption {
  method?: "GET" | "POST" | "DELETE" | "PUT";
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  singal?: AbortSignal;
}

type SendOption = Required<Pick<RequestOption, "method" | "headers">> &
  Omit<RequestOption, "method" | "header">;

const DEFAULT_OPTION: SendOption = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

/*
 * 合并请求options
 * */
export function extendOption(option: RequestOption) {
  return assignIn(cloneDeep(DEFAULT_OPTION), option);
}

export async function request<ReturnType = any>(
  url: string,
  option?: RequestOption
): Promise<{
  option: SendOption;
  data: ResponseType<ReturnType>;
}> {
  const _option: SendOption = option ? extendOption(option) : DEFAULT_OPTION;

  const response = await fetch(url, {
    ...omit(_option, "body"),
    body: _option.method === "GET" ? undefined : JSON.stringify(_option.body || "{}"),
  
  });

  if (['4', '5'].includes(response.status.toString().slice(0, 1))) {
    try {
      const body = await response.json();
      body.msg && message.error(body.msg);
    }catch(err) {
      //
    }
  }

  if (_option.headers["Content-Type"] === "application/json") {
    return {
      data: (await response.json()) as ResponseType<ReturnType>,
      option: _option,
    };
  }

  try {
    return {
      data: (await response.json()) as ResponseType<ReturnType>,
      option: _option,
    };
  } catch (err) {
    throw Error("request decode error!");
  }
}
