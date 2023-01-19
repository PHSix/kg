import mongoose from "mongoose";
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
    mongooseInstance = instance;
  })
  .catch((err) => console.error(err));

function getDomain() {
  return mongooseInstance.model("domain", DomainSchma);
}

function getGraph(graphName: string) {
  return mongooseInstance.model(graphName);
}

function getMongo() {
  return [mongooseInstance];
}

export { getMongo, getDomain, getGraph };
