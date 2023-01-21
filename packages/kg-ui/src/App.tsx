import type { FC } from "react";
import {GraphAttribute} from "./components/graph-attribute/graph-attribute";
import { GraphPicker } from "./components/graph-picker/graph-picker";
import {GraphViewer} from "./components/graph-viewer/graph-viewer";

const App: FC = function () {
  return (
    <main>
      <GraphPicker />
      <GraphViewer />
      <GraphAttribute />
    </main>
  );
};

export default App;
