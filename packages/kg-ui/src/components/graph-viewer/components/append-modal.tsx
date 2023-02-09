import { useBoolean } from "ahooks";
import { ImportOutlined, InboxOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, UploadProps } from "antd";
import { message, Upload, Modal } from "antd";
import styles from "./components.module.scss";

const { TextArea } = Input;

export const AppendModal = () => {
  const [visible, { toggle, setFalse }] = useBoolean();

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
        }}
      >
        <Form labelCol={{span: 5}}>
          <Form.Item label="节点名称" name={"name"} rules={[{required: true}]}>
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
