import type { FC } from "react";
import { GraphAttribute } from "./components/graph-attribute/graph-attribute";
import { GraphPicker } from "./components/graph-picker/graph-picker";
import { GraphViewer } from "./components/graph-viewer/graph-viewer";
import { ConfigProvider } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import zhCN from "antd/locale/zh_CN";
import "antd/dist/reset.css";
import { StoreProvider } from "./stores";

dayjs.locale("zh-cn");

const App: FC = function () {
  return (
    <ConfigProvider locale={zhCN}>
      <StoreProvider>
        <main>
          <GraphPicker />
          <GraphViewer />
        </main>
      </StoreProvider>
    </ConfigProvider>
  );
};

export default App;
