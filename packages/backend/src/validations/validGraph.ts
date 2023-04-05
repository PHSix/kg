import { z } from "zod";

const validGraph = z.object({
  graph: z.string(),
});

export default validGraph;
