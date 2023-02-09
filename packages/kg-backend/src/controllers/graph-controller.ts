import Koa from "koa";
import { getNeo4jSession } from "src/db/neo4j";

export const getGraphs = async function (ctx: Koa.Context) {
  const cql = "";
  // MATCH (n:`症状`) -[r]-(m:症状) where r.name='治疗' or r.name='危险因素' return n,m
  //
  const session = getNeo4jSession();

  try {
    const cqlResult = await session.run(cql);

    ctx.status = 200;
    ctx.response.body = {
      msg: "success",
      data: {},
    };
  } catch (err) {
    ctx.status = 500;
    ctx.response.body = {
      msg: "get neo4j session failed",
    };
    return;
  }
};

export const createNode = async function (ctx: Koa.Context) {
  ctx.status = 200;
  ctx.response.body = {
    msg: "success",
    data: {},
  };
};

export const renameNode = async function (ctx: Koa.Context) {
  ctx.status = 200;
  ctx.response.body = {
    msg: "success",
    data: {},
  };
};

export const removeNodes = async function (ctx: Koa.Context) {
  ctx.status = 200;
};

export const createLink = async function (ctx: Koa.Context) {
  ctx.status = 200;
  ctx.response.body = {
    msg: "success",
    data: {},
  };
};

export const renameLink = async function (ctx: Koa.Context) {
  ctx.status = 200;
  ctx.response.body = {
    msg: "success",
    data: {},
  };
};

export const removeLink = async function (ctx: Koa.Context) {
  ctx.status = 200;
};
