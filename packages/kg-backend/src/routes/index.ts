import Router from "@koa/router";
import domainRouter from "./domain";
import testRouter from "./test";

const router = new Router({prefix: '/api'});

router.use(domainRouter.routes());
router.use(testRouter.routes());

export default router;
