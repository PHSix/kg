import { ILink, INode } from "./type";
const DEFAULTHEADER = "id,group,name,from,to";

export function parseCsv(content: string) {
  const lines = content.split("\n");
  lines.shift(); // 去除表头
  const groupSet = new Set<string>();
  const { nodes, links } = lines.reduce(
    (t, c) => {
      const [id, group, name, source, target] = c.split(",");
      if (source !== "") {
        t.links.push({
          name: name === "" ? undefined : name,
          from: source,
          to: target,
          id: id,
        });
      } else {
        groupSet.add(group);
        t.nodes.push({
          group: group,
          name: name,
          id: id,
        });
      }
      return t;
    },
    {
      nodes: [] as {
        name: string;
        group: string;
        id: string;
      }[],
      links: [] as {
        from: string;
        to: string;
        id: string;
        name?: string;
      }[],
    }
  );
  return {
    nodes,
    links,
    groups: [...groupSet.values()],
  };
}

export function forCsv(nodes: INode[], links: ILink[]) {
  const idMap = new Map<string, string>();
  const text: string[] = [DEFAULTHEADER];

  nodes.forEach((n) => {
    const id = `${idMap.size + 1}`;
    idMap.set(n.id, id);

    const t = `${id},${n.schema_name},${n.name},,`;

    text.push(t);
  });
  links.forEach((l) => {
    const source = idMap.get(l.source)!;
    const target = idMap.get(l.target)!;
    const id = `${idMap.size + 1}`;
    idMap.set(l.id, id);
    const t = `${id},,${l.name ? l.name : ""},${source},${target}`;
    text.push(t);
  });
  return text.join("\n");
}
