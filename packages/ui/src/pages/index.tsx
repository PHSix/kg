import cs from "classnames";
import { Space, Popover, Spin } from "antd";
import {
  PlusSquareOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import React, { useMemo, useRef } from "react";
import { KBarProvider } from "kbar";
import { Force, IGraphProps } from "@bixi-design/graphs";

import styles from "./index.module.scss";
import { SearchBar } from "./components/search-bar";
import GraphSelector from "./components/graph-selector";
import graphStore from "../stores/graph";
import settingStore from "../stores/setting";
import SettingDrawer from "./components/setting-drawer";
import SuffixHeaderButtons from "./components/suffix-header-buttons";
import UpdateWindow from "./components/update-window";

const NODE_STATE_STYLES = {
  normal: {
    distance: 2,
    label: {
      show: true,
      space: "nowrap",
      textOffset: "10",
      rectFillStyle: "rgba(39, 56, 73, 0.8)",
      textWidth: 80,
    },
    shadowBlur: 0,
  },
};

export const IndexPage = () => {
  const barRef = useRef<{
    setOnOpen: VoidFunction;
  }>(null);
  const { graphName, nodes, links, isPulling } = graphStore;
  const data = useMemo(
    () => ({
      nodes,
      links,
    }),
    [nodes, links]
  );

  const forceBehaviors: Pick<
    IGraphProps,
    "onNodeClick" | "onLinkClick" | "onNodeDbClick" | "onLinkDbClick"
  > = {
    onNodeClick: (n) => {
      graphStore.currentNode = n;
      graphStore.currentLink = null;
    },
    onLinkClick: (l) => {
      graphStore.currentLink = l;
      graphStore.currentNode = null;
    },
    onNodeDbClick: (n) => {
      graphStore.updateBase = n;
    },
    onLinkDbClick: (l) => {
      graphStore.updateBase = l;
    },
  };

  return (
    <KBarProvider
      actions={[]}
      options={{
        callbacks: {
          onOpen: () => {
            barRef.current?.setOnOpen();
          },
        },
      }}
    >
      <main className={styles.indexContainer}>
        <GraphSelector />
        <section className={styles.viewContainer}>
          <div className={styles.searchHeader}>
            <span className={styles.graphName}>
              {graphName ? `Current Graph: ${graphName}` : "unselected"}
            </span>
            <SearchBar ref={barRef}></SearchBar>
            <SuffixHeaderButtons />
          </div>
          {isPulling ? (
            <Spin
              spinning={isPulling}
              className={styles.MaxHW}
              wrapperClassName={styles.MaxHW}
            ></Spin>
          ) : (
            <div className={styles.forceWrapper}>
              <Force
                data={data}
                nodeStateStyles={NODE_STATE_STYLES}
                {...forceBehaviors}
              />
            </div>
          )}
        </section>
      </main>
      <SettingDrawer />
      <UpdateWindow />
    </KBarProvider>
  );
};
