import { forwardRef, useImperativeHandle } from "react";
import { useBoolean } from "ahooks";
import styles from "./index.module.scss";
import classNames from "classnames";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Empty } from "antd";

type GraphAttributeRef = {
  editNode: (node: GraphNode) => void;
  editLink: (link: GraphLink) => void;
};

export const GraphAttribute = forwardRef<GraphAttributeRef>((_, ref) => {
  const [open, actions] = useBoolean(false);

  useImperativeHandle(ref, () => ({
    editLink() {},
    editNode() {},
  }));

  return (
    <div className={classNames(styles.wrapper)}>
      <div
        className={classNames(styles.drawer, {
          [styles.drawerOpen]: open,
          [styles.drawerClose]: !open,
        })}
      >
        <div className={styles.before}>
          <span
            className={classNames(styles.toggleButton, {
              [styles.rotate]: !open,
            })}
            onClick={() => actions.toggle()}
          >
            <ArrowRightOutlined />
          </span>
        </div>

        <Empty
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        ></Empty>
      </div>
    </div>
  );
});
