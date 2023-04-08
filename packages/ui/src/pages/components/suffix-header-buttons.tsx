import {
  DeleteOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useBoolean, useRequest } from "ahooks";
import { Modal, Space, Form, Input, Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useMemo } from "react";
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

const { useForm } = Form;

const SuffixHeaderButtons = () => {
  const [modalVisible, { toggle: toggleModal }] = useBoolean(false);
  const [addVisible, { toggle: toggleAdd }] = useBoolean(false);
  const [form] = useForm();
  const [groupForm] = useForm();
  const {
    graphName,
    currentNode,
    currentLink,
    pollGraph: updateGraph,
  } = graphStore;
  const btns = useMemo(
    () => [
      {
        children: <PlusOutlined />,
        onClick: () => {
          toggleModal();
        },
        disable: !graphName,
      },

      {
        children: <DeleteOutlined style={{ color: "red" }} />,
        onClick: () => {
          Modal.confirm({
            title: `confirm delete this ${currentLink ? "link" : "node"}?`,
            onOk: () => {
              (async () => {
                if (currentLink) {
                  await deleteLink(graphName!, currentLink.id);
                } else if (currentNode) {
                  await deleteNode(graphName!, currentNode.id);
                }
                updateGraph();
              })();
            },
          });
        },
        disable: !(currentLink || currentNode),
      },
      {
        children: <SettingOutlined />,
        onClick: () => {
          settingStore.drawerOpen = true;
        },
        disable: false,
      },
    ],
    [graphName, currentLink, currentNode]
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
        title={"Add Node"}
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
              updateGraph();
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
          <Form.Item name={"name"} label={"name"} rules={[{ required: true }]}>
            <Input placeholder="Please input node name" />
          </Form.Item>
          <Form.Item
            name={"group"}
            label={"group"}
            rules={[{ required: true }]}
          >
            <Select placeholder="Please select a group" options={options} />
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
              Not found? Create a new group?
            </a>
          </div>
        </Form>
      </Modal>

      <Modal
        open={fixVisible(addVisible)}
        title={"Add Group"}
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
          <Form.Item
            label={"group"}
            rules={[{ required: true }]}
            name={"group"}
          >
            <Input placeholder="Please input group name"></Input>
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
            {btn.children}
          </span>
        ))}
      </Space>
    </div>
  );
};

export default SuffixHeaderButtons;
