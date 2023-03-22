import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { IndexPage } from "./pages";

function App() {
  return (
    <div className="App">
      {/* <Force></Force> */}
      <BrowserRouter>
        <Routes>
          <Route index element={<IndexPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
