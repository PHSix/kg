import Koa from "koa";

/*
 *格式化响应格式
 * */
export const ResponseModel: () => Koa.Middleware = () => {
  return async (ctx, next) => {
    ctx.response.body = {}
    await next();
    if (ctx.response.status === 200) {
      ctx.response.body.msg = "success"
      // ctx.response.body = {
      //   data: ctx.response.body,
      //   status: "success",
      //   code: 200,
      // };
    } else if ([4,5].includes(Math.floor(ctx.status / 100))) {
      ctx.response.body.msg = ctx.response.body.msg || "failed request"
    }
  };
};
