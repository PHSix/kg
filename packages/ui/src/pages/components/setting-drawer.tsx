import { Drawer } from "antd";
import { FC } from "react";
import settingStore from "../../stores/setting";

const SettingDrawer: FC = () => {
  const { drawerOpen } = settingStore;
  return (
    <Drawer
      open={drawerOpen}
      onClose={() => {
        settingStore.drawerOpen = false;
      }}
      placement="right"
      title={"Settings"}
    >
      <section></section>
    </Drawer>
  );
};

export default SettingDrawer;
