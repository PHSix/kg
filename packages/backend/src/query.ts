import { exec } from 'child_process'
import { readFile } from 'fs/promises'
let _id = 1;
const uniqueID = () => {
  return _id++;
}

export async function query(topic: string) {
  const cwd = process.cwd() + "/query_kg/baike";
  await new Promise((resolve, reject) => {
    exec(`scrapy crawl baike -a topic=${topic}`, { cwd }, (error) => {
      if (error) {
        console.error(error)
        reject();
      }
      resolve(null);
    })
  });
  const buffers = await readFile("/tmp/query.csv");

  return buffers.toString().split("\n").filter(e => e !== "").reduce((total, line, index) => {
    const [from, relationship, to] = line.split(",")
    const fixID = (w: string) => {
      return `${w}-${uniqueID()}`
    }
    const fromID = from;
    const toID = fixID(to);
    if (index === 0) {
      total.nodes.push({
        id: fromID,
        label: from,
        name: from,
        schema_name: '知识点',
        extra: { name: from }
      });
    }
    total.links.push({
      source: fromID,
      target: toID,
      name: relationship
    })
    total.nodes.push({
      id: toID,
      label: to,
      schema_name: '属性',
      extra: { name: to }
    })
    return total;
  }, { nodes: [] as any[], links: [] as any[] })
}

