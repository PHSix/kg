import cs from "classnames";
import { Space, Popover } from "antd";
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
import { EditOver } from "./components/edit-over";
import { CreateOver } from "./components/create-over";
import { SearchBar } from "./components/search-bar";
import GraphSelector from "./components/graph-selector";
import graphStore from "../stores/graph";
import settingStore from "../stores/setting";
import SettingDrawer from "./components/setting-drawer";

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
  const { graphName, nodes, links } = graphStore;
  const data = useMemo(
    () => ({
      nodes,
      links,
    }),
    [nodes, links]
  );

  const behavior: Pick<IGraphProps, "onNodeClick" | "onLinkClick"> = {
    onNodeClick: (n) => {
      graphStore.currentNode = n;
      graphStore.currentLink = null;
    },
    onLinkClick: (l) => {
      graphStore.currentLink = l;
      graphStore.currentNode = null;
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
            <div className={styles.settingButton}>
              <span
                className={styles.settingOutline}
                onClick={() => {
                  settingStore.drawerOpen = true;
                }}
              >
                <SettingOutlined />
              </span>
            </div>
          </div>
          <div className={styles.forceWrapper}>
            <Force
              data={data}
              nodeStateStyles={NODE_STATE_STYLES}
              {...behavior}
            />
          </div>
        </section>
        {/* <section className={styles.panel}>
          <Space direction="vertical" size={"middle"}>
            {[
              {
                Icon: PlusSquareOutlined,
                Over: CreateOver,
              },
              {
                Icon: EditOutlined,
                Over: EditOver,
              },
              {
                Icon: DeleteOutlined,
                color: "#DC2626",
                Over: ({ children }: { children: React.ReactNode }) => {
                  return <Popover placement="left">{children}</Popover>;
                },
              },
            ].map(({ Icon, color, Over }, index) => {
              const isAble = true;
              return (
                <div
                  className={cs(styles.iconContainer, {
                    [styles.disableIcon]: !isAble,
                  })}
                  key={index}
                  onClick={() => {}}
                >
                  <Over>
                    <Icon
                      style={{
                        color: isAble ? color ?? "#111" : "#888",
                      }}
                    ></Icon>
                  </Over>
                </div>
              );
            })}
          </Space>
        </section> */}
      </main>
      <SettingDrawer />
    </KBarProvider>
  );
};
