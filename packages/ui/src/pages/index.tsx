import cs from "classnames";
import { Space, Popover } from "antd";
import {
  PlusSquareOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import React from "react";
import {KBarProvider} from "kbar";

import styles from "./index.module.scss";
import Force from "../force/force";
import { EditOver } from "./components/edit-over";
import { CreateOver } from "./components/create-over";
import { SearchBar } from "./components/search-bar";

export const IndexPage = () => {

  const actions = [
    {
      id: "blog",
      name: "Blog",
      shortcut: ["b"],
      keywords: "writing words",
      perform: () => (window.location.pathname = "blog"),
    },
    {
      id: "contact",
      name: "Contact",
      shortcut: ["c"],
      keywords: "email",
      perform: () => (window.location.pathname = "contact"),
    },
  ];
  return (
      <KBarProvider actions={actions}>
    <main className={styles.indexContainer}>
      <section className={styles.viewContainer}>
        <div className={styles.searchHeader}>
          <SearchBar></SearchBar>
        </div>
        <div className={styles.forceWrapper}>
          <Force></Force>
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
    </KBarProvider>
  );
};
