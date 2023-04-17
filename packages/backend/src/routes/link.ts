import { Router } from "express";
import { z } from "zod";
import validGraph from "../validations/validGraph";
import { neo4j } from "../db/neo4j";
const LINK_LABEL = "LINK_TO";

const linkRouter = Router();

linkRouter.post("/delete", async (req, res) => {
  const { from, to, graph, id } = z
    .object({
      id: z.string(),
      from: z.string(),
      to: z.string(),
      graph: z.string(),
    })
    .parse(req.body);
  const session = neo4j.session();
  const cql = `MATCH (n:\`${graph}\`)-[r]->(m:\`${graph}\`) 
WHERE elementId(n)="${from}" AND elementId(m)="${to}" AND elementId(r)="${id}"
DELETE r`;
console.log(cql)

  const response = await session.run(cql);

  res.send({
    code: 200,
    data: response.records,
    summary: response.summary
  });
});

const createLinkBody = z.object({
  from: z.string(),
  to: z.string(),
  name: z.string(),
});
/**
 * 创建关系
 */
linkRouter.post(
  "/",
  (req, res, next) => {
    try {
      validGraph.parse(req.query);
      return next();
    } catch (err) {
      res.status(400).send(err);
    }
  },
  async (req, res) => {
    const { graph } = req.query;
    const body = createLinkBody.parse(req.body);
    /**
   * MATCH (c1:company),(c2:company) 
WHERE c1.id = “281” AND c2.id = “879” CREATE (c1)-[r:INTERLOCK{weight:10}]->(c2) RETURN (c1)-[r]-(c2)
   */
    const session = neo4j.session();
    const cql = `MATCH (n1:\`${graph}\`),(n2:\`${graph}\`) WHERE elementId(n1)="${body.from}" AND elementId(n2)="${body.to}"
  CREATE (n1)-[r:${LINK_LABEL}{name: "${body.name}"}]->(n2) RETURN type(r)
  `;
    console.log(cql);
    const response = await session.run(cql);

    res.send({
      code: 200,
      data: response.records,
    });
  }
);

linkRouter.put("/:id", async (req, res) => {
  const { name, id, from, to, graph } = z
    .object({
      name: z.string(),
      from: z.string(),
      to: z.string(),
      id: z.string(),
      graph: z.string(),
    })
    .parse(req.body);

  const session = neo4j.session();
  const cql = `MATCH (n:\`${graph}\`)-[r]->(m:\`${graph}\`) 
WHERE elementId(n)="${from}" AND elementId(m)="${to}" AND elementId(r)="${id}" SET r.name="${name}"`;
  // const cql = `MATCH (l:\`${LINK_LABEL}\`) WHERE elementId(l)="${id}" SET l.name="${name}" RETURN l`;
  console.log(cql);
  const response = await session.run(cql);
  res.send({
    code: 200,
    data: response.records,
  });
});

export default linkRouter;
