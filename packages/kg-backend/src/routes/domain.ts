import Router from "@koa/router";
import {Domain} from 'kg-model'
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

    ctx.status = 200
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
  const body: Pick<Domain, 'name' | 'description'> = (ctx.req as any).body;
  const instance = getDomain();
  const date = new Date();

  const _domain: Domain =  {
    graphName: `graph-${date.getTime()}`,
    createAt: date,
    updateAt: date,
    ...body
  }
  
  try {
    const record = new instance({..._domain});
    await record.save();
  }catch (err) {
    ctx.status = 400;
    ctx.body = {
      msg: 'failed'
    }
  }
  ctx.status = 200
  ctx.body = {
    msg: "success"
  }
})

export default domainRouter
