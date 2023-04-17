import {
  ArrowRightOutlined,
  DeleteOutlined,
  DownloadOutlined,
  InboxOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useBoolean, useRequest } from "ahooks";
import {
  Modal,
  Space,
  Form,
  Input,
  Select,
  Upload,
  UploadProps,
  Tooltip,
} from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useMemo, useState } from "react";
import {
  createGroup,
  createNode,
  deleteNode,
  getNodeGroups,
} from "../../api/node";
import graphStore from "../../stores/graph";
import settingStore from "../../stores/setting";
import styles from "./components.module.scss";
import { deleteLink } from "../../api/link";
import MarkdownDoc from "./markdown-doc";

const { useForm } = Form;
const { Dragger } = Upload;

const SuffixHeaderButtons = () => {
  const [modalVisible, { toggle: toggleModal }] = useBoolean(false);
  const [addVisible, { toggle: toggleAdd }] = useBoolean(false);
  const [form] = useForm();
  const [groupForm] = useForm();
  const { graphName, pollGraph, currentBase } = graphStore;
  const [isNode, isLink] = useMemo(() => {
    if (!currentBase) {
      return [false, false];
    }

    if (currentBase.source) {
      return [false, true];
    }
    return [true, false];
  }, [currentBase]);

  const btns = useMemo(
    () => [
      {
        children: <DownloadOutlined />,
        onClick: () => {},
        disable: !graphName,
        tooltip: "导出图谱",
      },
      {
        // children: <UploadOutlined />,
        children: <UploadModal />,
        onClick: () => {},
        disable: !graphName,
        tooltip: "上传图谱",
      },
      {
        children: (
          <ArrowRightOutlined style={{ color: !isNode ? "#999" : "unset" }} />
        ),
        onClick: () => {
          graphStore.lockedNode = currentBase as any;
        },
        disable: !isNode,
        tooltip: "创建关系",
      },
      {
        children: (
          <PlusOutlined style={{ color: !graphName ? "#999" : "unset" }} />
        ),
        onClick: () => {
          toggleModal();
        },
        disable: !graphName,
        tooltip: "新增节点",
      },
      {
        children: (
          <DeleteOutlined
            style={{ color: !(isLink || isNode) ? "#999" : "red" }}
          />
        ),
        onClick: () => {
          Modal.confirm({
            title: `确定删除此${isLink ? "关系" : "节点"}?`,
            onOk: () => {
              (async () => {
                if (!currentBase) return;
                if (isLink) {
                  await deleteLink(currentBase!.id, {
                    graph: graphName!,
                    from: currentBase.source.id,
                    to: currentBase.target.id,
                  });
                } else if (isNode) {
                  await deleteNode(graphName!, currentBase!.id);
                }
                pollGraph();
              })();
            },
          });
        },
        disable: !(isLink || isNode),
        tooltip: `删除${isLink ? "关系" : "节点"}`,
      },
      {
        children: <SettingOutlined />,
        onClick: () => {
          settingStore.drawerOpen = true;
        },
        disable: false,
        tooltip: "设置",
      },
      {
        children: <QuestionCircleOutlined />,
        onClick: () => {
          Modal.info({
            title: "帮助",
            width: 1200,
            content: <MarkdownDoc />,
          });
        },
        disable: false,
        tooltip: "帮助",
      },
    ],
    [graphName, isNode, isLink, currentBase]
  );

  const fixVisible = (state: boolean) => {
    return state && !!graphName;
  };

  const { refresh: refreshOptions, data: options } = useRequest(
    async () => {
      if (!modalVisible || !graphName) {
        return [];
      }
      const response = await getNodeGroups(graphName);
      const groups: string[] = response.data.data;

      return groups.map<DefaultOptionType>((group) => ({
        label: group,
        value: group,
      }));
    },
    {
      refreshDeps: [modalVisible],
    }
  );

  return (
    <div className={styles.suffixButtons}>
      <Modal
        open={fixVisible(modalVisible)}
        title={"添加节点"}
        onOk={() => {
          form
            .validateFields()
            .then((value) => {
              return createNode(graphName!, {
                name: value.name,
                group: value.group,
              });
            })
            .then(() => {
              toggleModal();
              form.resetFields();
              pollGraph();
            })
            .catch((err) => {
              console.error(err);
            });
        }}
        onCancel={() => {
          toggleModal();
          form.resetFields();
        }}
      >
        <Form form={form} labelCol={{ span: 4 }}>
          <Form.Item name={"name"} label={"名称"} rules={[{ required: true }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item name={"group"} label={"分组"} rules={[{ required: true }]}>
            <Select placeholder="请选择节点分组" options={options} />
          </Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "30px",
            }}
          >
            <a
              onClick={(e) => {
                toggleAdd();
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              未找到分组？尝试创建新的分组？
            </a>
          </div>
        </Form>
      </Modal>

      <Modal
        open={fixVisible(addVisible)}
        title={"新增节点分组"}
        onOk={() => {
          groupForm
            .validateFields()
            .then((value) => {
              return createGroup(graphName!, value.group);
            })
            .then(() => {
              toggleAdd();
              groupForm.resetFields();
              refreshOptions();
            })
            .catch(() => {});
        }}
        onCancel={() => {
          toggleAdd();
          groupForm.resetFields();
        }}
      >
        <Form form={groupForm}>
          <Form.Item label={"分组"} rules={[{ required: true }]} name={"group"}>
            <Input placeholder="请选择节点分组"></Input>
          </Form.Item>
        </Form>
      </Modal>
      <Space size={"middle"}>
        {btns.map((btn, index) => (
          <span
            key={index}
            className={styles.buttonOutline}
            style={{
              cursor: btn.disable ? "not-allowed" : "pointer",
              // backgroundColor: btn.disable ? "#eee" : "unset",
            }}
            onClick={btn.disable ? undefined : btn.onClick}
          >
            <Tooltip title={btn.tooltip}>{btn.children}</Tooltip>
          </span>
        ))}
      </Space>
    </div>
  );
};

const UploadModal = () => {
  const [visible, { toggle }] = useBoolean(false);
  const uploadProps: UploadProps = useMemo(
    () => ({
      name: "file",
      multiple: true,
      action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      onChange(info) {
        // const { status } = info.file;
        // if (status !== "uploading") {
        //   console.log(info.file, info.fileList);
        // }
        // if (status === "done") {
        //   message.success(`${info.file.name} file uploaded successfully.`);
        // } else if (status === "error") {
        //   message.error(`${info.file.name} file upload failed.`);
        // }
      },
      onDrop(e) {
        // console.log("Dropped files", e.dataTransfer.files);
      },
    }),
    []
  );
  return (
    <>
      <UploadOutlined
        onClick={() => {
          toggle();
        }}
      />
      <Modal
        open={visible}
        title={"Upload a csv file"}
        onCancel={() => {
          toggle();
        }}
      >
        <div>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from
              uploading company data or other banned files.
            </p>
          </Dragger>
        </div>
      </Modal>
    </>
  );
};

export default SuffixHeaderButtons;
