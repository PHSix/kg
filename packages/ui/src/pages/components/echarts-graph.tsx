import styles from "./components.module.scss";
import { ILink, INode } from "@bixi-design/graphs";
import * as echarts from "echarts";
import { FC, useEffect, useMemo, useRef } from "react";
import graphStore from "../../stores/graph";
import { notification } from "antd";
import { createLink } from "../../api/link";
import { throttle } from "radash";

const getOption = ([nodes, links]: [INode[], ILink[]], name: string) => {
  const categories = [
    ...nodes
      .reduce((res, c) => {
        !res.has(c.schema_name) && res.add(c.schema_name);
        return res;
      }, new Set<string>())
      .values(),
  ];
  return {
    tooltip: {},
    legend: [
      {
        data: categories,
        // data: graph.categories.map(function (a) {
        //   return a.name;
        // })
      },
    ],
    series: [
      {
        name,
        type: "graph",
        layout: "force",
        selectedMode: true,
        select: {
          itemStyle: {
            borderColor: "#38BDF8",
            borderWidth: 3,
          },
        },
        draggable: true,
        symbolSize: 40,
        data: nodes.map((node) => ({
          name: node.name || node.label,
          id: node.id,
          category: node.schema_name,
          value: node,
        })),
        links: links.map((link) => ({
          source: link.source,
          target: link.target,
          value: link,
          name: link.name || link.label,
          id: link.id,
        })),
        edgeLabel: {
          show: true,
          formatter: (l: any) => {
            return l.data.name;
          },
        },
        categories: categories.map((name) => ({ name })),
        roam: true,
        label: {
          show: true,
          position: "inside",
        },
        force: {
          repulsion: 300,
        },
      },
    ],
  };
};

export const EchartsGraph: FC<{
  inputRef: any;
}> = ({ inputRef }) => {
  const ref = useRef<HTMLDivElement>(null);
  const graphRef = useRef<echarts.ECharts>();
  const { graphName, nodes, links, lockedNode, pollGraph } = graphStore;
  const graphData = useMemo(
    () => [nodes, links] as [INode[], ILink[]],
    [nodes, links]
  );

  const clickCountRef = useRef<number>();
  const clickEvRef = useRef({
    onNodeClick: (_: any) => {},
    onLinkClick: (_: any) => {},
    onLinkDbClick: (_: any) => {},
    onNodeDbClick: (_: any) => {},
  });

  const fixLink = (l: any) => {
    return {
      ...l,
      source: nodes.find((node) => node.id === l.source),
      target: nodes.find((node) => node.id === l.target),
    };
  };

  clickEvRef.current = {
    onNodeClick: async (n: any) => {
      if (lockedNode) {
        if (lockedNode.id === n.id) {
          notification.error({
            placement: "bottomRight",
            message: "选中的两个节点不能为同一节点",
          });
          return;
        }
        const from = lockedNode,
          to = n;
        try {
          const name: string = (await inputRef.current!.getInputName()) as any;
          await createLink(graphName!, {
            from: from.id,
            to: to.id,
            name,
          });
          pollGraph();
          graphStore.lockedNode = null;
        } catch {}
      } else {
        graphStore.currentBase = n;
      }
    },
    onLinkClick: (_l: any) => {
      const l: any = fixLink(_l);
      graphStore.currentBase = l;
      // if (clickCountRef.current) {
      //   clearTimeout(clickCountRef.current);
      //   graphStore.updateBase = l;
      //   clickCountRef.current = undefined;
      // } else {
      //   clickCountRef.current = setTimeout(() => {
      //     graphStore.currentBase = l;
      //     clickCountRef.current = undefined;
      //   }, 400);
      // }
    },

    onLinkDbClick: (_l: any) => {
      const l: any = fixLink(_l);
      graphStore.updateBase = l;
    },
    onNodeDbClick: (n: any) => {
      graphStore.updateBase = n;
    },
  };

  useEffect(() => {
    if (ref.current && !graphRef.current) {
      graphRef.current = echarts.init(ref.current);
      graphRef.current.on(
        "click",
        throttle(
          {
            interval: 10,
          },
          (params) => {
            const _item = params.data.valueOf();
            if (typeof _item === "object") {
              const item: any = _item;
              if (item.source) {
                clickEvRef.current.onLinkClick(item.value);
              } else {
                clickEvRef.current.onNodeClick(item.value);
              }
            }
          }
        )
      );

      graphRef.current.on(
        "dblclick",
        throttle(
          {
            interval: 10,
          },
          (params) => {
            const _item = params.data.valueOf();
            if (typeof _item === "object") {
              const item: any = _item;
              if (item.source) {
                clickEvRef.current.onLinkDbClick(item.value);
              } else {
                clickEvRef.current.onNodeDbClick(item.value);
              }
            }
          }
        )
      );
    }
    return () => {
      graphRef.current?.dispose();
      graphRef.current = undefined;
    };
  }, [ref.current]);

  useEffect(() => {
    if (graphRef.current) {
      const option = getOption(graphData, graphName || "");
      graphRef.current.setOption(option);
    }
  }, [graphData]);

  return <div className={styles.echartGraph} ref={ref}></div>;
};
