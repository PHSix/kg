import { useBoolean } from "ahooks";
import { ImportOutlined, InboxOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, UploadProps } from "antd";
import { message, Upload, Modal } from "antd";
import styles from "./components.module.scss";
import { uniqueId } from "lodash-es";
import { useContext } from "react";
import { viewerContext } from "../context";
import { ForceNodeType } from "kg-model";

const { TextArea } = Input;

export const AppendModal = () => {
  const [visible, { toggle, setFalse }] = useBoolean();
  const { onAppendNodeOk } = useContext(viewerContext);
  const [form] = Form.useForm();

  return (
    <>
      <div
        onClick={() => {
          toggle();
        }}
        className={styles.rowItem}
      >
        <PlusOutlined></PlusOutlined>
        新增
      </div>
      <Modal
        title="新增节点"
        open={visible}
        onCancel={() => {
          setFalse();
          setTimeout(() => form.resetFields(), 100);
        }}
        onOk={() => {
          form.validateFields().then((value) => {
            const node: ForceNodeType = {
              id: uniqueId(),
              properties: {
                title: value.name,
                description: value.description,
              },
            };
            onAppendNodeOk(node);

            setFalse();
            setTimeout(() => form.resetFields(), 100);
          });
        }}
      >
        <Form labelCol={{ span: 5 }} form={form}>
          <Form.Item label="节点名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入节点名称"></Input>
          </Form.Item>
          <Form.Item label="节点描述" name={"description"}>
            <TextArea placeholder="请输入节点描述信息" cols={6}></TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
