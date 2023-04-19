import express from "express";
import morgan from "morgan";
import { mongoInitial } from "./db/mongo";
import indexRouter from "./routes";
import { neo4jInitial } from "./db/neo4j";

const PORT = 3001;

(async () => {
  await mongoInitial();
  await neo4jInitial();
  const app = express();
  // app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use(morgan("tiny"));

  app.use(indexRouter);

  // @ts-ignore
  app.use((error, req, res, next) => {
    res.status(400).send(error);
  });

  app.listen(PORT, () => {
    console.log(`server have start on http://localhost:${PORT}`);
  });
})();
