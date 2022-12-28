import Router from "@koa/router";

export class TestApi {
	constructor(router: Router) {
		router.get("/test", (ctx) => {
			ctx.response.status = 200;
		});
	}
}
