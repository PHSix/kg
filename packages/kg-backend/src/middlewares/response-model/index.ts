import Koa from "koa";

/*
 *格式化响应格式
 * */
export const ResponseModel: () => Koa.Middleware = () => {
  return async (ctx, next) => {
    await next();
    if (ctx.response.status === 200) {
      ctx.response.body = {
        data: ctx.response.body,
        status: "success",
        code: 200,
      };
    } else if (ctx.response.status >= 400 && ctx.response.status < 500) {
      ctx.response.body = {
        data: ctx.response.body,
        status: "error",
        code: 400,
      };
    }
  };
};
