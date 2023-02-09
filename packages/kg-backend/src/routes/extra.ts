import Router from "@koa/router";
import { exportFile, importFile } from "src/controllers/extra-controller";

const extraRouter = new Router();

extraRouter.get("/export", exportFile);

extraRouter.post("/import", importFile);

export default extraRouter;
