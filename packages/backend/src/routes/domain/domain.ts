import {Router} from "express";
import {Domain} from "../../db/mongo";
import z from 'zod'

const domainRouter = Router()

/*
 * 获取所有的图谱
 * */
domainRouter.get('/', async (_, res) => {
  // const domains: any = []
  const domains = await Domain.find()
  res.send({
    code: 200,
    data: domains
  })
})

const PostBody = z.object({
  name: z.string(),
});

/*
 * 创建图谱
 * */
domainRouter.post('/', async (req, res) => {
  const body = PostBody.parse(req.body)
  if ((await Domain.find({
    name: body.name
  })).length > 0) {
    res.status(200).send(
      {
        code: 400,
        msg: `The graph named ${body.name} have existd.`
      }
    )
    return
  }
  const _d = new Domain({
    name: body.name
  })
  await new Promise(resovle => {
    _d.save(() => {resovle(null)})
  })

  res.send({
    code: 200,
    data: _d
  })
})


/*
 * 删除图谱
 * */
domainRouter.delete('/:name', async (req, res) => {
  const {name} = req.params;
  if ((await Domain.find({name})).length === 0) {
    res.send({
      code: 400,
      msg: "The graph is not existd."
    })
    return
  }

  await Domain.deleteOne({
    name
  })
  res.send({
    code: 200,
    msg: "successful"
  })
})


const PutBody = z.object({
  oldName: z.string(),
  newName: z.string()
})
/*
 * 重命名图谱
 * */
domainRouter.put('/', async (req, res) => {
  const body = PutBody.parse(req.body)
  await Domain.updateOne({name: body.oldName}, {name: body.newName})
  res.send({
    code: 200,
    msg: "success"
  })
})
export default domainRouter
