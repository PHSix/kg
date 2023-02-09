import { FC, useLayoutEffect, useMemo, useRef } from "react";
import styles from "./index.module.scss";
import type { Props } from "./type";
import { ForceClass } from "./forceClass";

/**
 * d3.js force graph component
 */
export const ForceGraph: FC<Props> = ({ nodes, links }) => {
  // convers props to initail
  const dataProps = useMemo(
    () => ({
      nodes: nodes || [],
      links: links || [],
    }),
    [nodes, links]
  );

  // dom ref
  const wrapperRef = useRef<HTMLDivElement>(null);
  const forceClassRef = useRef<ForceClass>();

  useLayoutEffect(() => {
    fetch("/localGraph.json")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (forceClassRef.current) return;
        const force = new ForceClass(data, {});

        wrapperRef.current && force.mountContainer(wrapperRef.current);
        forceClassRef.current = force;
      });
    return () => {
      if (forceClassRef.current) {
        forceClassRef.current.umount();
        forceClassRef.current = undefined;
      }
    };
  }, []);
  // const forceInstanceRef = useRef<any>();
  //
  // useMount(() => {
  //   fetch("/graph.json")
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((graph) => {
  //     if (forceClassRef.current) return
  //       const chart = ForceGraphFn(graph, {
  //         nodeId: (d: any) => d.id,
  //         nodeGroup: (d: any) => d.group,
  //         nodeTitle: (d: any) => `${d.id} (${d.group})`,
  //         height: 680,
  //       });
  //       wrapperRef.current?.appendChild(chart)
  //       forceInstanceRef.current = chart;
  //     });
  // });
  return <div className={styles.graphWrapper} ref={wrapperRef}></div>;
};
