import Koa from 'koa'
import log from 'src/utils/log';

export const exportFile = async (ctx: Koa.Context) => {
  ctx.status = 200;
}

export const importFile = async (ctx: Koa.Context) => {
  log.info(ctx.body)
  ctx.status = 200;
}
