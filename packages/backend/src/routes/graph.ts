import { Router } from "express";
import { Graph } from "../db/mongo";
import z from "zod";
import { neo4j } from "../db/neo4j";
import { pick } from "radash";
import transform from "../transformer/transform";
import { LINK_LABEL } from "./link";

const graphRouter = Router();

/*
 * 获取所有的图谱
 * */
graphRouter.get("/", async (_, res) => {
  // const domains: any = []
  const domains = await Graph.find();
  res.send({
    code: 200,
    data: domains,
  });
});

const PostBody = z.object({
  name: z.string(),
});

/*
 * 创建图谱
 * */
graphRouter.post("/", async (req, res) => {
  const body: any = PostBody.parse(req.body);
  body.groups = [];
  if (
    (
      await Graph.find({
        name: body.name,
      })
    ).length > 0
  ) {
    res.status(400).send({
      code: 400,
      msg: `The graph named ${body.name} have existd.`,
    });
    return;
  }
  const _d = new Graph({
    ...body,
  });
  await new Promise((resovle) => {
    _d.save(() => {
      resovle(null);
    });
  });

  res.send({
    code: 200,
    data: _d,
  });
});

/*
 * 删除图谱
 * */
graphRouter.delete("/:name", async (req, res) => {
  const { name } = req.params;
  if ((await Graph.find({ name })).length === 0) {
    res.send({
      code: 400,
      msg: "The graph is not existd.",
    });
    return;
  }
  const session = neo4j.session();
  await session.run(`MATCH n(\`${name}\`) DETACH DELETE n`);

  await Graph.deleteOne({
    name,
  });
  res.send({
    code: 200,
    msg: "successful",
  });
});

const PutBody = z.object({
  oldName: z.string(),
  newName: z.string(),
});
/*
 * 重命名图谱
 * */
graphRouter.put("/", async (req, res) => {
  const body = PutBody.parse(req.body);
  const session = neo4j.session();
  await session.run(
    `MATCH (n:\`${body.oldName}\`) SET n:\`${body.newName}\` REMOVE n:\`${body.oldName}\``
  );
  await Graph.updateOne({ name: body.oldName }, { name: body.newName });
  res.send({
    code: 200,
    msg: "success",
  });
  session.close();
});

const bulkBody = z.object({
  nodes: z.array(
    z.object({
      name: z.string(),
      id: z.string(),
      group: z.string(),
    })
  ),
  links: z.array(
    z
      .object({
        from: z.string(),
        to: z.string(),
        name: z.string(),
      })
      .partial({ name: true })
  ),
  groups: z.array(z.string()),
});
/**
 * 上传创建
 */
graphRouter.post(
  "/bulkCreate",
  // (req, res, next) => {
  //   try {
  //     validGraph.parse(req.query);
  //     next();
  //   } catch (err) {
  //     res.status(400).send(err);
  //   }
  // },
  async (req, res) => {
    const graph = (req.query as any).graph as string;
    const g = await Graph.findOne({
      name: graph,
    });
    if (g) {
      const { groups } = g;
      const body = bulkBody.parse(req.body);
      const savedGroups = body.groups.filter((group) => !groups.includes(group));
      if (savedGroups.length > 0) {
        await Graph.updateOne(
          {
            name: graph,
          },
          {
            groups: [...groups, ...savedGroups],
          }
        );
      }
      const { nodes: reqNodes, links: reqLinks } = body;
      const session = neo4j.session();
      const nodeIdMap = new Map<string, string>();
      const nodeIds: string[] = [];
      const createNodeCql = `
UNWIND [${reqNodes
          .map((node) => {
            nodeIds.push(node.id);
            return `{name: "${node.name}", group: "${node.group}"}`;
          })
          .join(", ")}] as node
CREATE (n:\`${graph}\` {name: node.name, group: node.group})
RETURN n
`;
      const response = await session.run(createNodeCql);
      const { nodes } = transform(response.records);
      nodes.forEach((node, index) => {
        nodeIdMap.set(nodeIds[index], node.id);
      });
      const createLinkCql = `UNWIND [${reqLinks
        .filter((link) => nodeIdMap.get(link.from) && nodeIdMap.get(link.to))
        .map((link) => {
          const from = nodeIdMap.get(link.from)!;
          const to = nodeIdMap.get(link.to)!;

          return `{ from: "${from}", to: "${to}", name: "${link.name || ""}" }`;
        })
        .join(",")}] as link
MATCH (n1:\`${graph}\`),(n2:\`${graph}\`) WHERE elementId(n1)=link.from AND elementId(n2)=link.to
CREATE (n1)-[r:${LINK_LABEL}{name: link.name}]->(n2)
RETURN r
`;
      const linkResponse = await session.run(createLinkCql);

      res.send({
        node: response,
        link: linkResponse,
      });
    }
  }
);
export default graphRouter;
