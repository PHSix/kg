import { Drawer, Form, InputNumber } from "antd";
import { FC } from "react";
import settingStore from "../../stores/setting";

const SettingDrawer: FC = () => {
  const { drawerOpen, depth } = settingStore;
  return (
    <Drawer
      open={drawerOpen}
      onClose={() => {
        settingStore.drawerOpen = false;
      }}
      placement="right"
      title={"Settings"}
    >
      <Form labelCol={{ span: 10 }}>
        <Form.Item label="Node find depth">
          <InputNumber
            value={depth}
            onChange={(e) => {
              if (e && typeof e === "number") {
                settingStore.depth = e;
              }
            }}
          ></InputNumber>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default SettingDrawer;
