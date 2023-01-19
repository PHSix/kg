import Router from "@koa/router";

const testRouter = new Router()

testRouter.get('/test', (ctx) => {
  ctx.status = 200;
})


export default testRouter
