import { Tag } from "antd";
import type { FC } from "react";
import styles from "./index.module.scss";

export const GraphPicker: FC = () => {
  const graphs = [
    {
      name: "111",
    },
    {
      name: "222",
    },

    {
      name: "333",
    },
    {
      name: "444",
    },
  ];
  return (
    <aside className={styles.sider}>
      <div className={styles.tags}>
        {graphs.map((graph) => {
          return (
            <Tag color={"orange"} className={styles.tag}>
              {graph.name}
            </Tag>
          );
        })}
      </div>
    </aside>
  );
};
