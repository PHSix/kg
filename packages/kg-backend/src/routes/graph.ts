import Router from "@koa/router";
import {getGraphs} from "src/controllers/graph-controller";
import {getNeo4jSession} from "src/db/neo4j";

const graphRouter = new Router();

graphRouter.use(async (ctx, next) => {
  if (!ctx.params['domain'] && !(ctx.req as any).body['domain']) {
    ctx.response.status = 500;
    ctx.response.body = {
      msg: "need with a domain argument in this http request"
    }
  }
  try {
    getNeo4jSession();
  }catch {
    ctx.response.body = {
      msg: "get neo4j graph session failed"
    }
  }
  await next()
})


graphRouter.get('/graphs', getGraphs)


export default graphRouter
