import { useBoolean, useRequest } from "ahooks";
import { Form, Input, message, Modal, Spin, Tag } from "antd";
import { FC, useState } from "react";
import { useCurrentDomain } from "../../stores/currentDomain";
import styles from "./index.module.scss";
import { postDomain } from "./services";
import type { TagProps } from "antd";
import type { DomainType } from "kg-model";

const { TextArea } = Input;

const HoverTag = function (
  props: Omit<TagProps, "color" | "onMouseEnter" | "onMouseLeave">
) {
  const [color, setColor] = useState("orange");
  return (
    <Tag
      {...props}
      color={color}
      onMouseEnter={() => {
        setColor("green");
      }}
      onMouseLeave={() => {
        setColor("orange");
      }}
    ></Tag>
  );
};

/*
 * 图谱选择器
 * */
export const GraphPicker: FC = () => {
  const [modalOpen, { toggle: toggleModal }] = useBoolean();
  const [form] = Form.useForm();
  const { updateDomain } = useCurrentDomain();

  const [submiting, { toggle: toggleSubmiting }] = useBoolean(false);

  const {
    refreshAsync,
    data: domains,
    loading,
  } = useRequest(async () => {
    return Promise.resolve(
      ["图谱1", "测试图谱", "内容图谱", "关系图谱"].map<DomainType>((name) => ({
        name,
        createAt: new Date(),
        updateAt: new Date(),
        description: "",
        graphName: name,
      }))
    );
    // return getDomains().then((res) => {
    //   const _domains = get(res, "data.data.results", []) as Domain[];
    //   return _domains;
    // });
  });

  const appendDomain = async () => {
    return form
      .validateFields()
      .then((values) => {
        return postDomain(values);
      })
      .then(() => {
        toggleModal();
        toggleSubmiting();
        form.resetFields();
        return refreshAsync();
      })
      .catch(() => message.error("新增领域失败"))
      .finally(() => {
        toggleSubmiting();
      });
  };

  return (
    <aside className={styles.sider}>
      <Spin spinning={loading}>
        <div className={styles.tags}>
          {(domains || []).map((domain) => {
            return (
              <HoverTag
                // color={"orange"}
                className={styles.tag}
                key={domain.graphName}
                onClick={() => {
                  updateDomain(domain);
                }}
              >
                {domain.name}
              </HoverTag>
            );
          })}
          <Tag
            className={styles.appendButton}
            onClick={() => {
              toggleModal();
            }}
          >
            新增图谱
          </Tag>
        </div>
      </Spin>
      <Modal
        open={modalOpen}
        confirmLoading={submiting}
        onOk={appendDomain}
        onCancel={() => {
          toggleModal();
        }}
        title="新增图谱"
      >
        <Form form={form}>
          <Form.Item label="图谱名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入图谱名称"></Input>
          </Form.Item>
          <Form.Item
            label="图谱描述"
            name="description"
            // rules={[{ required: true }]}
          >
            <TextArea placeholder="请输入图谱名称" cols={6}></TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </aside>
  );
};
