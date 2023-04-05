import { Router } from "express";
import validGraph from "../validations/validGraph";

const linkRouter = Router();
linkRouter.use((req, res, next) => {
  try {
    validGraph.parse(req.query);
    return next();
  } catch (err) {
    res.status(400).send(err);
  }
});

linkRouter.delete("/:id", async (req, res) => {
  const { graph } = req.query;
});

linkRouter.post("/", async (req, res) => {
  const { graph } = req.query;
});

export default linkRouter;
