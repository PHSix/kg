import { useBoolean } from "ahooks";
import { ImportOutlined, InboxOutlined, PlusOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload, Modal } from "antd";
import styles from "./components.module.scss";

const { Dragger } = Upload;

export const ImportModal = () => {
  const [visible, { toggle, setFalse }] = useBoolean();

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  return (
    <>
      <div
        onClick={() => {
          toggle();
        }}
        className={styles.rowItem}
      >
        <ImportOutlined></ImportOutlined>
        导入
      </div>

      <Modal
        title="导入"
        open={visible}
        onCancel={() => {
          setFalse();
        }}
      >
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from
            uploading company data or other band files
          </p>
        </Dragger>
      </Modal>
    </>
  );
};
