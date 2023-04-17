import { Routes, Route, BrowserRouter } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import zhCN from "antd/locale/zh_CN";
import "antd/dist/reset.css";
import { ConfigProvider } from "antd";
import { IndexPage } from "./pages";
import "./App.css";

dayjs.locale("zh-cn");

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route index element={<IndexPage />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ConfigProvider>
  );
}

export default App;
