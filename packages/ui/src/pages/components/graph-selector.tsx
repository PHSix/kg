import { PlusOutlined } from "@ant-design/icons";
import { useBoolean, useRequest, useUpdate, useUpdateEffect } from "ahooks";
import { Button, Input, Modal, Tag, Form } from "antd";
import { FC, useEffect } from "react";
import graphStore from "../../stores/graph";
import request from "../../utils/request";
import styles from "./components.module.scss";

const { useForm } = Form;

const GraphSelector: FC = () => {
  const { graphName, pollGraph: updateGraph } = graphStore;
  const [open, { toggle: toggleOpen }] = useBoolean(false);
  const [confirmLoading, { toggle: toggleLoading }] = useBoolean(false);
  const { data, refresh, loading } = useRequest(async () => {
    return await request.get("/api/graph").then((res) => {
      return res.data.data as any[];
    });
  });
  useUpdateEffect(() => {
    graphStore.isPulling = loading;
  }, [loading]);
  const [form] = useForm();
  return (
    <section className={styles.selectorContainer}>
      {(data || []).map((graph) => {
        return (
          <Tag
            className={styles.domainTag}
            color={graphName === graph.name ? "red" : "orange"}
            key={graph.name}
            onClick={() => {
              updateGraph(graph.name);
              // graphStore.graphName = graph.name;
            }}
          >
            {graph.name}
          </Tag>
        );
      })}
      <Button
        className={styles.plusButton}
        onClick={() => {
          toggleOpen();
        }}
      >
        <PlusOutlined></PlusOutlined>
      </Button>
      <Modal
        closable={false}
        title={"Create a new Graph"}
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
            label="Graph Name"
            rules={[{ required: true }]}
            name="name"
          >
            <Input></Input>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default GraphSelector;
