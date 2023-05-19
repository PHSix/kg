import { Drawer, Form, InputNumber, Segmented, Switch } from "antd";
import { FC } from "react";
import graphStore from "../../stores/graph";
import settingStore from "../../stores/setting";

const SettingDrawer: FC = () => {
  const { drawerOpen, depth, displayAttribute } = settingStore;
  return (
    <Drawer
      open={drawerOpen}
      onClose={() => {
        settingStore.drawerOpen = false;
      }}
      placement="right"
      title={"设置"}
    >
      <Form>
        <Form.Item label="搜索节点的查找最深深度">
          <InputNumber
            value={depth}
            onChange={(e) => {
              if (e && typeof e === "number") {
                settingStore.depth = e;
              }
            }}
          ></InputNumber>
        </Form.Item>

        <Form.Item label="搜索模式">
          <Segmented
            options={[
              {
                label: "双向搜索",
                value: "both",
              },
              {
                label: "从节点指出",
                value: "out",
              },
              {
                label: "指向节点",
                value: "in",
              },
            ]}
            defaultValue="both"
            onChange={(value) => {
              graphStore.direction = value as any;
            }}
          ></Segmented>
        </Form.Item>
        <Form.Item label="是否展示属性窗口">
          <Switch
            checked={displayAttribute}
            onClick={() => {
              settingStore.displayAttribute = !displayAttribute;
            }}
          ></Switch>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default SettingDrawer;
