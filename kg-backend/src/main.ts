import Koa from "koa";
import { RequestLogger } from "./middlewares/request-logger";
import { ResponseModel } from "./middlewares/response-model";
import router from "./routes";

export const main = (port: number) => {
	const app = new Koa();

	app.use(ResponseModel());
	app.use(RequestLogger());
	app.use(router.routes());

	app.listen(port);

	return app;
};
