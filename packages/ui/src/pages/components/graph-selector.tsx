import { PlusOutlined } from "@ant-design/icons";
import { useBoolean, useRequest, useUpdateEffect } from "ahooks";
import { Button, Input, Modal, Tag, Form, Tooltip } from "antd";
import { FC, useEffect, useLayoutEffect, useRef } from "react";
import graphStore from "../../stores/graph";
import request from "../../utils/request";
import styles from "./components.module.scss";

const { useForm } = Form;

const GraphSelector: FC = () => {
  const { graphName, pollGraph } = graphStore;
  const [open, { toggle: toggleOpen }] = useBoolean(false);
  const [confirmLoading, { toggle: toggleLoading }] = useBoolean(false);

  /**
   * when mouse hover selector trigger this setState
   * use mouseenter and mouseleave event to implement.
   */
  const [isHover, { set: setHover }] = useBoolean(false);

  const onMouseEnter = () => {
    setHover(true);
  };

  const onMouseLeave = () => {
    setHover(false);
  };

  const abortRef = useRef(new AbortController());
  const { data, refresh, loading } = useRequest(async () => {
    return await request.get("/api/graph").then((res) => {
      return res.data.data as { name: string; groups: string[] }[];
    });
  });
  useLayoutEffect(() => {
    if (graphName === null && data && data.length > 0) {
      pollGraph(data[0].name, abortRef.current);
    }
  }, [data, graphName]);

  useUpdateEffect(() => {
    graphStore.isPulling = loading;
  }, [loading]);

  const [form] = useForm();

  return (
    <section
      className={styles.selectorContainer}
      style={{
        // right: "0",
        zIndex: 1000,
        right: isHover ? "0" : "-270px",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.selectorWrapper}>
        {(data || []).map((graph) => {
          return (
            <Tag
              className={styles.domainTag}
              color={graphName === graph.name ? "red" : "orange"}
              key={graph.name}
              onClick={() => {
                pollGraph(graph.name, abortRef.current);
              }}
            >
              {graph.name}
            </Tag>
          );
        })}
        <Tooltip title="创建新的知识图谱" placement="bottom">
          <Button
            className={styles.plusButton}
            onClick={() => {
              toggleOpen();
            }}
          >
            <PlusOutlined></PlusOutlined>
          </Button>
        </Tooltip>
        <Modal
          closable={false}
          title={"新增图谱"}
          open={open}
          confirmLoading={confirmLoading}
          onOk={() => {
            toggleLoading();
            form
              .validateFields()
              .then(async (value) => {
                toggleOpen();
                form.resetFields();
                await request.post("/api/graph", value);
                refresh();
              })
              .catch(() => {})
              .finally(() => {
                toggleLoading();
              });
          }}
          onCancel={() => {
            toggleOpen();
            form.resetFields();
          }}
        >
          <Form form={form}>
            <Form.Item
              label="图谱名称"
              rules={[{ required: true }]}
              name="name"
            >
              <Input></Input>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </section>
  );
};

export default GraphSelector;
