import {Router} from "express";
import domainRouter from "./domain/domain";
import nodeRouter from "./node/node";
const indexRouter = Router();
const _apiRouter = Router();

indexRouter.use("/api", _apiRouter);


domainRouter.use('/node', nodeRouter)
_apiRouter.use('/domain', domainRouter)

export default indexRouter;
