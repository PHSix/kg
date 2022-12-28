import Router from "@koa/router";
import { TestApi } from "./test";

const router = new Router();

new TestApi(router);

export default router;
