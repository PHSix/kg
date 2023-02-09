import {
  DeleteOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useBoolean } from "ahooks";
import { Empty, Modal } from "antd";
import type { FC } from "react";
import { useCurrentDomain } from "../../stores/currentDomain";
import { ForceGraph } from "../force-graph/force-graph";
// import {ForceGraph} from "../force-graph/force-graph";
import { GraphAttribute } from "../graph-attribute/graph-attribute";
import { GraphG6 } from "../graph-g6/graph-g6";
import { AppendModal } from "./components/append-modal";
import { ImportModal } from "./components/import-modal";
import styles from "./index.module.scss";

export const GraphViewer: FC = () => {
  const { domainName } = useCurrentDomain();
  return (
    <section className={styles.container}>
      <TopPanel></TopPanel>
      <div className={styles.content}>
        <div className={styles.graph}>
          {/* <GraphG6 /> */}
          <ForceGraph />
          {/* {domainName ? <div></div> : <Empty></Empty>} */}
        </div>
        <GraphAttribute />
      </div>
    </section>
  );
};

const TopPanel = () => {
  const { domainName } = useCurrentDomain();
  return (
    <>
      <div className={styles.topPanel}>
        <div className={styles.title}>{domainName || "--"}</div>
        <div className={styles.topSuffix}>
          <AppendModal></AppendModal>
          <ImportModal></ImportModal>
          <div className={styles.rowItem}>
            <ExportOutlined></ExportOutlined>
            导出
          </div>
        </div>
      </div>
    </>
  );
};
