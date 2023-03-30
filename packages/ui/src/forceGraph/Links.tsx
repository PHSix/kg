import cs from "classnames";
import { FC, useEffect } from "react";
import { ForceLinkType } from "@model";
import * as d3 from "d3";
import styles from "./styles.module.scss";

const Links: FC<{
  data?: ForceLinkType[];
}> = ({ data = [] }) => {
  useEffect(() => {
    const link = d3.selectAll(".force-link");
    link.data(data)
  }, [data]);
  return (
    <g className={styles.forceLinksGroup}>
      {data.map((_, index) => {
        return (
          <line
            key={index}
            className={cs("force-link", styles.forceLink)}
            strokeWidth={1.5}
            stroke={"#999"}
            strokeOpacity={1}
            strokeLinecap={"round"}
          ></line>
        );
      })}
    </g>
  );
};

export default Links;
