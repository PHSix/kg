import {Router} from "express";
import {neo4j} from "../../utils/neo4j";
import {omit} from 'radash'

const nodeRouter = Router();

/*
 * 获取所有节点
 * */
nodeRouter.get("/", async (req, res) => {
  const {graph} = req.query;
  const session = neo4j.session()

  const response = await session.run(`match (n:\`${graph}\`) return n`);
  const records: any[] = response.records;
  const nodes = records.map(record => {
    const [field] = record._fields
    return {
      _labels: field.labels,
      properties: omit(field.properties, ['born']),
      id: field.elementId
    }
  })
  res.send({
    code: 200,
    data: nodes
  })
  session.close()
});

/*
 * 获取某个节点的数据，包括获取该节点的相关数据
 * */
nodeRouter.get("/:id", async (req, res) => {
  const {graph} = req.query
  const {id} = req.params

  const session = neo4j.session()
  const response = await session.run(`match (n:\`${graph}\`) where elementId(n)="${id}" return n`);
  const records: any[] = response.records;

  res.send({
    code: 200,
    data: records
  })

  session.close()
});

/*
 * 创建节点
 * */
nodeRouter.post("/", async (req, res) => {
  const body = req.body

  res.send({
    code: 200,
    msg: "create success"
  })
})

export default nodeRouter;
