import { useBoolean, useRequest } from "ahooks";
import { Form, Input, message, Modal, Spin, Tag } from "antd";
import { get } from "lodash-es";
import { Domain } from "kg-model";
import { FC } from "react";
import { useCurrentDomain } from "../../stores/currentDomain";
import styles from "./index.module.scss";
import { getDomains, postDomain } from "./services";

const { TextArea } = Input;

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
    return Promise.resolve([] as Domain[])
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
              <Tag
                color={"orange"}
                className={styles.tag}
                key={domain.graphName}
                onClick={() => {
                  updateDomain(domain);
                }}
              >
                {domain.name}
              </Tag>
            );
          })}
          <Tag
            className={styles.appendButton}
            onClick={() => {
              toggleModal();
            }}
          >
            添加领域
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
        title="新增领域"
      >
        <Form form={form}>
          <Form.Item label="领域名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入领域名称"></Input>
          </Form.Item>
          <Form.Item
            label="领域描述"
            name="description"
            rules={[{ required: true }]}
          >
            <TextArea placeholder="请输入领域名称" cols={6}></TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </aside>
  );
};
