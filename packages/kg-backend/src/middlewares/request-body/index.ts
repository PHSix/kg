import Koa from "koa";

export const RequestBody = (): Koa.Middleware => {
  return async (ctx, next) => {
    if (
      ctx.request.header["content-type"] === "application" &&
      ["PUT", "POST"].includes(ctx.request.method.toUpperCase())
    ) {
      const body = await new Promise((resolve) => {
        const d: string[] = [];

        ctx.req.on("data", (data) => {
          d.push(data);
        });
        ctx.req.on("end", () => {
          console.log(d)
          resolve(d.join());
        });
      });

      ctx.req.body = body;
    }
    else {
      ctx.req.body = {}
    }
  };
};
