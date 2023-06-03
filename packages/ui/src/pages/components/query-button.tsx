import { SearchOutlined } from "@ant-design/icons";
import { Button, Empty, Input, Skeleton, Space, notification } from "antd";
import Modal from "antd/es/modal/Modal";
import { FC, memo, useEffect, useRef, useState } from "react";
import { ILink, INode } from "@bixi-design/graphs";
import { bulkCreate, getQuery } from "../../api/graph";
import * as echarts from "echarts";
import graphStore from "../../stores/graph";

const getOption = ([nodes, links]: [INode[], ILink[]]) => {
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
      },
    ],
    series: [
      {
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
        })),
        links: links.map((link) => ({
          source: link.source,
          target: link.target,
          name: link.name,
          id: `${link.name}-${link.source}-${link.target}`,
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

export const QueryButton: FC = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    nodes: [] as INode[],
    links: [] as ILink[],
  });
  const { graphName, pollGraph } = graphStore;
  return (
    <>
      <SearchOutlined onClick={() => setOpen(true)} />
      <Modal
        open={open}
        destroyOnClose
        closable={false}
        width={"70vw"}
        footer={
          <Space>
            <Button
              loading={loading}
              onClick={() => {
                const _data = {
                  nodes: [] as any[],
                  links: [] as any[],
                  groups: ["知识点", "属性"],
                };
                _data.nodes = data.nodes.map((n) => ({
                  name: n.label || n.name,
                  group: n.schema_name,
                  id: n.id,
                }));
                _data.links = data.links.map((n) => ({
                  from: n.source,
                  to: n.target,
                  name: n.label || n.name,
                }));
                setLoading(true);
                bulkCreate(graphName!, _data)
                  .then((res) => {
                    notification.success({
                      message: "导入图谱成功",
                      placement: "bottomRight",
                    });
                    setLoading(false);
                    setOpen(false);
                  })
                  .then(() => {
                    pollGraph();
                  });
              }}
              type="primary"
              disabled={data.nodes.length === 0}
            >
              导入
            </Button>
            <Button
              loading={loading}
              onClick={() => {
                setOpen(false);
              }}
            >
              关闭
            </Button>
          </Space>
        }
      >
        <Space.Compact style={{ width: "100%" }}>
          <Input
            placeholder="请输入搜索知识点关键字"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            type="primary"
            loading={loading}
            onClick={() => {
              setLoading(true);
              getQuery(value)
                .then((res) => {
                  setData(res.data.data);
                })
                .finally(() => setLoading(false));
            }}
          >
            搜索
          </Button>
        </Space.Compact>
        <section style={{ paddingTop: "1em", height: "60vh" }}>
          {loading ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : data.nodes.length === 0 ? (
            <Empty
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
              description="未爬取到相关结果内容"
            />
          ) : (
            <EchartsForce data={data}></EchartsForce>
          )}
        </section>
      </Modal>
    </>
  );
};

const EchartsForce: FC<{
  data: {
    nodes: INode[];
    links: ILink[];
  };
}> = memo(({ data }) => {
  const ref = useRef<HTMLDivElement>(null);
  const graphRef = useRef<echarts.ECharts>();
  useEffect(() => {
    if (ref.current) {
      graphRef.current = echarts.init(ref.current);
    }
    () => {
      graphRef.current?.dispose();
    };
  }, []);
  useEffect(() => {
    if (graphRef.current) {
      const option = getOption([data.nodes, data.links]);
      graphRef.current.setOption(option);
    }
  }, [data]);
  console.log(data);
  return <div ref={ref} style={{ height: "100%", width: "100%" }}></div>;
});
