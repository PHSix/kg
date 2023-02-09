import chalk from "chalk";
import Koa from "koa";
import {RequestBody} from "./middlewares/request-body";
import { RequestLogger } from "./middlewares/request-logger";
import { ResponseModel } from "./middlewares/response-model";
import router from "./routes";
import log from "./utils/log";

export const main = (port: number) => {
	const app = new Koa();

  app.use(RequestBody())
	app.use(ResponseModel());
	app.use(RequestLogger());
	app.use(router.routes());

	app.listen(port);

  log.info(chalk.bgGreen(`Server start in ${port} port`));

	return app;
};
