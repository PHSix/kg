import { PlusOutlined } from "@ant-design/icons";
import { useBoolean, useRequest } from "ahooks";
import { Button, Input, Modal, Tag, Form } from "antd";
import { FC } from "react";
import domainStore from "../../stores/domain";
import request from "../../utils/request";
import styles from "./components.module.scss";

const { useForm } = Form;

const DomainSelector: FC = () => {
  const { graphName } = domainStore;
  const [open, { toggle: toggleOpen }] = useBoolean(false);
  const [confirmLoading, { toggle: toggleLoading }] = useBoolean(false);
  const { data, refresh } = useRequest(async () => {
    return await request.get("/api/domain").then((res) => {
      return res.data.data as any[];
    });
  });
  const [form] = useForm();
  return (
    <section className={styles.selectorContainer}>
      {(data || []).map((domain) => {
        return (
          <Tag
            className={styles.domainTag}
            color={graphName === domain.name ? "red" : "orange"}
            key={domain.name}
            onClick={() => {
              domainStore.graphName = domain.name;
            }}
          >
            {domain.name}
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
              await request.post("/api/domain", value);
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

export default DomainSelector;
