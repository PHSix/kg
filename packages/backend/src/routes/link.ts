import { Router } from "express";
import { z } from 'zod'
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


const createLinkBody = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string(),
})
/**
 * 创建关系
 */
linkRouter.post("/", async (req, res) => {
  const { graph } = req.query;
  const body = createLinkBody.parse(req.body)
  /**
   * MATCH (c1:company),(c2:company) 
WHERE c1.id = “281” AND c2.id = “879” CREATE (c1)-[r:INTERLOCK{weight:10}]->(c2) RETURN (c1)-[r]-(c2)
   */
});

export default linkRouter;
