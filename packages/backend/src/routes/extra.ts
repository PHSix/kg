import { Router } from "express";
import multer from "multer";
import { readFile } from "fs/promises";

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
  const headerAttrbutes = lines.shift()!.split("\n");
  let sourceIndex = -1,
    targetIndex = -1,
    propertiesIndex = -1;
  headerAttrbutes.forEach((a, index) => {
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

export default extraRouter;
