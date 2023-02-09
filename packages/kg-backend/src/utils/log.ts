import log4js from "log4js";

log4js.configure({
  appenders: {
    stdout: {
      type: "stdout",
    },
    logFile: {
      type: "dateFile",
      filename: ".kg.log",
      pattern: "-yyyy-MM-dd",
      compress: true,
    },
  },
  categories: {
    default: {
      appenders: ["stdout", "logFile"],
      level: "debug",
    },
  },
});

export const log = log4js.getLogger();

export default log;
