import { Drawer, Form, InputNumber, Switch } from "antd";
import { FC } from "react";
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
      <Form labelCol={{ span: 14 }}>
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
