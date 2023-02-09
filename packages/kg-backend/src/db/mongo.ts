import chalk from "chalk";
import mongoose from "mongoose";
import log from "src/utils/log";
import { DomainSchma } from "./schemas/domain";

mongoose.set("strictQuery", false);
var mongooseInstance: typeof mongoose;
mongoose
  .connect("mongodb://root:example@localhost:27017", {
    dbName: "kg",
    // auth: {
    //   name: "root",
    //   password: "example",
    // },
  })
  .then((instance) => {
    log.info(chalk.bgGreen("connected mongodb service successful"))
    mongooseInstance = instance;
  })
  .catch((err) => console.error(err));

function getDomain() {
  return mongooseInstance.model("domain", DomainSchma);
}

function getGraphModel(graphName: string) {
  return mongooseInstance.model(graphName);
}

function getMongoModel() {
  return [mongooseInstance];
}

export { getMongoModel, getDomain, getGraphModel };
