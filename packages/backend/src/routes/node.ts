import { Router } from "express";
import { neo4j } from "../db/neo4j";
import { omit } from "radash";
import validGraph from "../validations/validGraph";
import transform from "../transformer/transform";

const nodeRouter = Router();
nodeRouter.use(async (req, res, next) => {
  try {
    validGraph.parse(req.query);
    return next();
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

/*
 * 获取所有节点
 * */
nodeRouter.get("/", async (req, res) => {
  const { graph } = req.query;
  const session = neo4j.session();

  const response = await session.run(`match (n:\`${graph}\`) return n`);
  const records: any[] = response.records;
  const nodes = records.map((record) => {
    const [field] = record._fields;
    return {
      _labels: field.labels,
      properties: omit(field.properties, ["born"]),
      id: field.elementId,
    };
  });
  res.send({
    code: 200,
    data: nodes,
  });
  session.close();
});

/*
 * 获取整个图的所有信息
 * */
nodeRouter.get("/get", async (req, res) => {
  const { graph } = req.query;
  const session = neo4j.session();
  const response = await session.run(
    `MATCH (n:\`${graph}\`)-[r]-(m:\`${graph}\`) RETURN n,r,m`,
    {
      graph,
    }
  );
  res.send({
    code: 200,
    data: {
      summary: response.summary,
      ...transform(response.records),
    },
  });
  session.close();
});

/*
 * 获取某个节点的数据，包括获取该节点展开的图
 * */
nodeRouter.get("/get/:id", async (req, res) => {
  const { graph } = req.query;
  const { id } = req.params;

  const session = neo4j.session();
  const response = await session.run(
    `MATCH (n:\`${graph}\`)-[r]-(m:\`${graph}\`) WHERE elementId(n)="${id}" RETURN n,r,m`,
  );

  res.send({
    code: 200,
    data: {
      query: response.summary.query,
      ...transform(response.records),
    },
  });

  session.close();
});

/*
 * 创建节点
 * */
nodeRouter.post("/", async (req, res) => {
  const { graph } = req.query;
  const body = req.body;

  res.send({
    code: 200,
    msg: "create success",
  });
});

/*
 * 删除节点
 * */
nodeRouter.delete("/:id", async (req, res) => {
  const { graph } = req.query;
  const { id } = req.params;

  res.send({
    code: 200,
    msg: "delete success",
  });
});

/*
 * 更新节点数据
 * */
nodeRouter.put("/:id", async (req, res) => {
  const { graph } = req.query;
  const { id } = req.params;
  res.send({
    code: 200,
    msg: "update node success",
  });
});

export default nodeRouter;
