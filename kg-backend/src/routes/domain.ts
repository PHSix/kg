import Router from "@koa/router";
import { getDomain } from "../db/mongo";

const domainRouter = new Router();

/**
 * 获取全部领域
 */
domainRouter.get("/domains", async (ctx) => {
  try {
    const instance = getDomain();
    const query = instance.find({});
    const results = await query.exec()

    ctx.response.body = {
      data: {
        results,
      },
    };
  } catch (err) {
    console.error(err)
    ctx.status = 500;
  }
});

// 创建领域
domainRouter.post('/domain', async (ctx) => {
  ctx.status = 200
  ctx.body = {
    msg: "success"
  }
})

export default domainRouter
