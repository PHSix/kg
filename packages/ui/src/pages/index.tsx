import cs from "classnames";
import { Space, Popover } from "antd";
import {
  PlusSquareOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import React, { useRef } from "react";
import { KBarProvider } from "kbar";

import styles from "./index.module.scss";
import { EditOver } from "./components/edit-over";
import { CreateOver } from "./components/create-over";
import { SearchBar } from "./components/search-bar";
import DomainSelector from "./components/domain-selector";
import domainStore from "../stores/domain";
import ForceGraph from "../forceGraph";
import miserables from "../stores/miserables";
import settingStore from "../stores/settting";
import SettingDrawer from "./components/setting-drawer";

export const IndexPage = () => {
  const barRef = useRef<{
    setOnOpen: VoidFunction;
  }>(null);
  const { graphName } = domainStore;
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
        <DomainSelector />
        <section className={styles.viewContainer}>
          <div className={styles.searchHeader}>
            <span className={styles.graphName}>Current Graph: {graphName}</span>
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
            <ForceGraph
              nodes={miserables.nodes}
              links={miserables.links}
            ></ForceGraph>
          </div>
        </section>
        <section className={styles.panel}>
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
              const isable = true;
              return (
                <div
                  className={cs(styles.iconContainer, {
                    [styles.disableIcon]: !isable,
                  })}
                  key={index}
                  onClick={() => {}}
                >
                  <Over>
                    <Icon
                      style={{
                        color: isable ? color ?? "#111" : "#888",
                      }}
                    ></Icon>
                  </Over>
                </div>
              );
            })}
          </Space>
        </section>
      </main>
      <SettingDrawer />
    </KBarProvider>
  );
};
