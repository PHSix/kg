import { toNumber, isNaN } from "lodash";
import { main } from "./main";
if (process.argv.length > 2 && !isNaN(toNumber(process.argv[2]))) {
	main(toNumber(process.argv[2]));
} else {
	console.error("请输入正确的端口号", process.argv[2]);
}
