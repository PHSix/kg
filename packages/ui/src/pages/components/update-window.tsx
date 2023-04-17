import { Modal, Form, Select, Input } from "antd";
import graphStore from "../../stores/graph";
import { useEffect, useMemo } from "react";
import { useRequest } from "ahooks";
import { getNodeGroups, updateNode } from "../../api/node";
import { DefaultOptionType } from "antd/es/select";
import { updateLink } from "../../api/link";
const { useForm } = Form;

const UpdateWindow = () => {
  const { updateBase, graphName, pollGraph } = graphStore;
  const open = useMemo(() => {
    if (updateBase) {
      return true;
    }
    return false;
  }, [updateBase]);
  const isNode = !updateBase?.source;
  const [form] = useForm();

  const { data: options } = useRequest(
    async () => {
      if (!open || !graphName) {
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
      refreshDeps: [open],
    }
  );
  useEffect(() => {
    if (!open) {
      return;
    }

    form.setFieldsValue({
      name: updateBase?.name,
      group: updateBase?.group,
    });
  }, [open, options]);

  return (
    <Modal
      title={`修改 ${updateBase?.source ? "关系" : "节点"} 属性`}
      open={open}
      onOk={() => {
        form
          .validateFields()
          .then(async (value) => {
            if (updateBase) {
              if (isNode) {
                await updateNode(graphName!, updateBase.id, value);
              } else {
                await updateLink(updateBase.id, {
                  name: value.name,
                  from: updateBase.source.id,
                  to: updateBase.target.id,
                  id: updateBase.id,
                  graph: graphName!,
                });
              }
            }
          })
          .then(() => {
            graphStore.updateBase = null;
            pollGraph();
          })
          .catch(() => {});
      }}
      onCancel={() => {
        graphStore.updateBase = null;
      }}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item name={"name"} label={"名字"} rules={[{ required: true }]}>
          <Input placeholder="请输入名字" />
        </Form.Item>
        {isNode && (
          <Form.Item
            name={"group"}
            label={"节点分组"}
            rules={[{ required: true }]}
          >
            <Select placeholder="请选择一个节点分组" options={options} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default UpdateWindow;
