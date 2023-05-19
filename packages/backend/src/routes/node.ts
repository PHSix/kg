import { Router } from "express";
import { neo4j } from "../db/neo4j";
import { omit } from "radash";
import { z } from "zod";
import validGraph from "../validations/validGraph";
import transform from "../transformer/transform";
import { Graph } from "../db/mongo";

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
 * 获取整个图，包括节点和关系
 * */
nodeRouter.get("/get", async (req, res) => {
  const { graph } = req.query;
  const session = neo4j.session();
  const nodeRes = await session.run(`MATCH (n:\`${graph}\`) RETURN n`);
  const linkRes = await session.run(
    `MATCH (:\`${graph}\`)-[r]-(:\`${graph}\`) return r`
  );

  res.send({
    code: 200,
    data: {
      summary: nodeRes.summary,
      linkSummary: linkRes.summary,
      ...transform([...nodeRes.records, ...linkRes.records]),
    },
  });
  session.close();
});

/*
 * 获取某个节点的数据，包括获取该节点展开的图
 * */
nodeRouter.get("/get/:id", async (req, res) => {
  const { graph, depth = 2, direction = "both" } = req.query;
  const { id } = req.params;

  const session = neo4j.session();
  let cql: string;
  if (direction === "in") {
    cql = `MATCH (m:\`${graph}\`)-[r*..${depth}]->(n:\`${graph}\`) WHERE elementId(n)="${id}" RETURN n,r,m`;
  } else if (direction === "out") {
    cql = `MATCH (n:\`${graph}\`)-[r*..${depth}]->(m:\`${graph}\`) WHERE elementId(n)="${id}" RETURN n,r,m`;
  } else {
    cql = `MATCH (n:\`${graph}\`)-[r*..${depth}]-(m:\`${graph}\`) WHERE elementId(n)="${id}" RETURN n,r,m`;
  }
  const reRes = await session.run(cql);
  const thisRes = await session.run(
    `MATCH (n:\`${graph}\`) WHERE elementId(n)="${id}" RETURN n`
  );

  res.send({
    code: 200,
    data: {
      summary: reRes.summary,
      thisSummary: thisRes.summary,
      ...transform([...thisRes.records, ...reRes.records]),
    },
  });

  session.close();
});

const createNodeBody = z.object({
  name: z.string(),
  group: z.string(),
});
/*
 * 创建节点
 * */
nodeRouter.post("/", async (req, res) => {
  const { graph } = req.query;
  const body = createNodeBody.parse(req.body);
  const session = neo4j.session();
  const response = await session.run(
    `CREATE (n:\`${graph}\` { name: "${body.name}", group: "${body.group}" })`
  );
  session.close();

  res.send({
    code: 200,
    msg: "create success",
    summary: response.summary,
  });
});

/*
 * 删除节点
 * */
nodeRouter.delete("/:id", async (req, res) => {
  const { graph } = req.query;
  const { id } = req.params;
  const session = neo4j.session();
  const response = await session.run(
    `MATCH (n:\`${graph}\`) WHERE elementId(n)="${id}" DETACH DELETE n`
  );

  res.send({
    code: 200,
    msg: "delete success",
    summary: response.summary,
  });
  session.close();
});

const PutNodeBody = z.object({
  name: z.string(),
  group: z.string(),
});

/*
 * 更新节点数据
 * */
nodeRouter.put("/:id", async (req, res) => {
  const { graph } = req.query;
  const { id } = req.params;
  const body = PutNodeBody.parse(req.body);
  const session = neo4j.session();
  const cql = `MATCH (n:\`${graph}\`) WHERE elementId(n)="${id}" SET n.name="${body.name}",n.group="${body.group}" RETURN n`;
  const response = await session.run(cql);
  res.send({
    code: 200,
    msg: "update node success",
    data: response.records,
  });
});

/*
 * 获取节点的所有组
 * */
nodeRouter.get("/group", async (req, res) => {
  const { graph } = req.query;
  const d = await Graph.findOne({
    name: graph,
  });
  if (d) {
    res.send({
      code: 200,
      data: d.groups,
    });
  } else {
    res.status(400).send({
      code: 400,
      data: d,
    });
  }
});

/**
 * 创建节点组
 */
nodeRouter.post("/group", async (req, res) => {
  const { graph } = req.query;
  const { group } = req.body;
  const d = await Graph.findOne({
    name: graph,
  });
  let err;
  if (d && !d.groups.includes(group)) {
    try {
      await Graph.updateOne(
        { name: graph },
        {
          groups: [...d.groups, group],
        }
      );
      res.send({
        code: 200,
        msg: "success",
      });
      return;
    } catch (e) {
      err = e;
    }
  }

  res.status(400).send({
    code: 400,
    msg: err,
  });
});

export default nodeRouter;
