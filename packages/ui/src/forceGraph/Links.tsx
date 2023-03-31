import cs from "classnames";
import { FC, useContext, useEffect } from "react";
import { ForceLinkType } from "@model";
import * as d3 from "d3";
import styles from "./styles.module.scss";
import { forceContext } from "./Provider";

const Links: FC<{
  data?: ForceLinkType[];
}> = ({ data = [] }) => {
  const { select } = useContext(forceContext);

  useEffect(() => {
    const link = d3.selectAll(".force-link");
    link.data(data);
    link.on("click", (_, d: any) => {
      select(d);
    });
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
