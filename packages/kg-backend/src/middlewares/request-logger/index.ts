import Koa from "koa";
import chalk from "chalk";
import { toString, toUpper } from "lodash";
import log from "src/utils/log";

interface LoggerParams {
	method: string;
	url: string;
	statusCode: number;
}

type Logger = (params: LoggerParams) => void;

// 请求log的中间件
export const RequestLogger = (logger?: Logger): Koa.Middleware => {
	if (!logger) {
		logger = defaultLogger;
	}
	return async (ctx, next) => {
		await next();
		logger?.({
			method: ctx.method,
			url: ctx.URL.href,
			statusCode: ctx.status,
		});
	};
};

const MethodColors: Record<string, string> = {
	GET: "#059669",
	POST: "#3B82F6",
	PUT: "#F59E0B",
	DELETE: "#EF4444",
};

const StatusColors: Record<string, string> = {
	"2": "#16A34A",
	"3": "#D97706",
	"4": "#DC2626",
	"5": "#DC2626",
};

/**
 * 默认的Logger，打印输出到控制台
 */
const defaultLogger = (params: LoggerParams) => {
  
	const method = toUpper(params.method);
	const code = toString(params.statusCode);
	log.info(
		` ${chalk.bgHex(MethodColors[method] || "#DC2626")(` ${method} `)}  ${
			params.url
		}  ${chalk.bgHex(StatusColors[code.slice(0, 1)] || "#DC2626")(` ${code} `)}`
	);
};
