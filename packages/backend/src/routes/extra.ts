import { Router } from "express";
import multer from "multer";
import { readFile } from "fs/promises";
import { query } from "../query";

const extraRouter = Router();
const upload = multer({ dest: "uploads/" });

/*
 * 上传csv文件
 * */
extraRouter.post("/upload/csv", upload.single("file"), async (req, res) => {
  const { file, body } = req;
  if (!file) {
    res.status(400).send({
      code: 400,
      msg: "please upload a file",
    });
    return;
  }
  const fileBuf = await readFile(file.path);
  const content = fileBuf.toString();

  const lines = content.split("\n");
  if (lines.length < 1) {
    res.status(400).send({
      code: 400,
      msg: "please upload have content csv file",
    });
    return;
  }
  const headerAttributes = lines.shift()!.split("\n");
  let sourceIndex = -1,
    targetIndex = -1,
    propertiesIndex = -1;
  headerAttributes.forEach((a, index) => {
    switch (a) {
      case "source":
        sourceIndex = index;
        break;
      case "target":
        targetIndex = index;
        break;
      case "properties":
        propertiesIndex = index;
        break;
    }
  });

  if ([sourceIndex, targetIndex, propertiesIndex].includes(-1)) {
    res.status(400).send({
      code: 400,
      msg: "upload file must have source,target,properties columns",
    });
    return;
  }

  lines.map((line) => {
    const s = line.split("\n");
    if (s[sourceIndex] === 'null' || s[targetIndex] === "null") {
      // TODO: handle csv file
    }
  });

  res.send({
    code: 200,
    msg: "success",
  });
});

extraRouter.get('/download/csv', async (req, res) => {
  const { graph } = req.query;
  if (!graph) {
    res.send({
      code: 400,
      msg: "without get graph field in request query"
    })
    return;
  }

  res.send({
    code: 200,
    data: []
  })
})

extraRouter.get("/query", async (req, res) => {
  const { topic } = req.query;
  const data = await query(topic as string)
  res.send({
    code: 200,
    data
  })
})


export default extraRouter;
