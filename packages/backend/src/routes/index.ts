import { Router } from "express";
import extraRouter from "./extra";
import graphRouter from "./graph";
import nodeRouter from "./node";
import linkRouter from "./link";
const indexRouter = Router();
const _apiRouter = Router();

indexRouter.use("/api", _apiRouter);

graphRouter.use("/node", nodeRouter);
graphRouter.use("/link", linkRouter);
_apiRouter.use("/graph", graphRouter);
_apiRouter.use("/extra", extraRouter)

export default indexRouter;
