import Koa from "koa";

export const RequestBody = (): Koa.Middleware => {
  return async (ctx, next) => {
    if (
      ctx.request.header["content-type"] === "application/json" &&
      ["PUT", "POST"].includes(ctx.request.method.toUpperCase())
    ) {
      const body = await new Promise((resolve) => {
        const d: string[] = [];

        ctx.req.on("data", (data) => {
          d.push(data);
        });
        ctx.req.on("end", () => {
          try {
            resolve(JSON.parse(d.join()));
          } catch {
            resolve(d.join());
          }
        });
      });

      (ctx.req as any).body = body;
    } else {
      (ctx.req as any).body = {};
    }

    return next();
  };
};
