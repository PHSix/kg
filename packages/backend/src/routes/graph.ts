import { Router } from "express";
import { Domain } from "../db/mongo";
import z from "zod";
import { neo4j } from "../db/neo4j";

const graphRouter = Router();

/*
 * 获取所有的图谱
 * */
graphRouter.get("/", async (_, res) => {
  // const domains: any = []
  const domains = await Domain.find();
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
  const body = PostBody.parse(req.body);
  if (
    (
      await Domain.find({
        name: body.name,
      })
    ).length > 0
  ) {
    res.status(200).send({
      code: 400,
      msg: `The graph named ${body.name} have existd.`,
    });
    return;
  }
  const _d = new Domain({
    name: body.name,
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
  if ((await Domain.find({ name })).length === 0) {
    res.send({
      code: 400,
      msg: "The graph is not existd.",
    });
    return;
  }
  const session = neo4j.session();
  await session.run(`MATCH n(\`${name}\`) DETACH DELETE n`);

  await Domain.deleteOne({
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
  await Domain.updateOne({ name: body.oldName }, { name: body.newName });
  res.send({
    code: 200,
    msg: "success",
  });
  session.close();
});
export default graphRouter;