import { Modal, Form, Select, Input } from "antd";
import graphStore from "../../stores/graph";
import { useEffect, useMemo } from "react";
import { useRequest } from "ahooks";
import { getNodeGroups, updateNode } from "../../api/node";
import { DefaultOptionType } from "antd/es/select";
import { updateLink } from "../../api/link";
import { pick } from "radash";
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
      group: updateBase?.source,
    });
  }, [open, options]);

  return (
    <Modal
      title={`Update ${updateBase?.source ? "link" : "node"} attribute`}
      open={open}
      onOk={() => {
        form
          .validateFields()
          .then(async (value) => {
            if (isNode) {
              await updateNode(graphName!, value);
            } else {
              await updateLink(graphName!, pick(value, ["name"]));
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
        <Form.Item name={"name"} label={"name"} rules={[{ required: true }]}>
          <Input placeholder="Please input node name" />
        </Form.Item>
        {isNode && (
          <Form.Item
            name={"group"}
            label={"group"}
            rules={[{ required: true }]}
          >
            <Select placeholder="Please select a group" options={options} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default UpdateWindow;
