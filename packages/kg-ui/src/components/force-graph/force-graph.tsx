import {
  FC,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import styles from "./index.module.scss";
import type { ForceRef, Props } from "./type";
import { ForceSvg } from "./forceSvg";
import { ForceCanvas } from "./forceCanvas";
import { cloneDeep } from "lodash-es";

/**
 * d3.js force graph component
 */
export const ForceGraph = forwardRef<ForceRef, Props>(
  ({ nodes, links }, ref) => {
    // convers props to initail
    const dataProps = useMemo(
      () => ({
        nodes: nodes || [],
        links: links || [],
      }),
      [nodes, links]
    );

    useImperativeHandle(ref, () => {
      return {
        appendNode: (d) => {
          const force = forceClassRef.current;
          if (!force) return;
          // force.update([...force.nodes, d], force.links)
          force.nodes.push(d);
          force.refresh()
        },
      };
    });

    // dom ref
    const wrapperRef = useRef<HTMLDivElement>(null);
    const forceClassRef = useRef<ForceSvg>();

    const eventBind = useCallback(
      (force: ForceSvg) => {
        force.handler.onNodeClick((d) => {
          console.log("click node: ", d);
        });
        force.handler.onNodeDoubleClick((d) => {
          console.log("double click node: ", d);
        });
        force.handler.onLinkClick((d) => {
          console.log("click link: ", d);
        });
        force.handler.onLinkDoubleClick((d) => {
          console.log("double click link: ", d);
        });
      },
      [forceClassRef.current]
    );

    useLayoutEffect(() => {
      fetch("/localGraph.json")
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (forceClassRef.current) return;
          const force = new ForceSvg(data, {});
          eventBind(force);

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

    return <div className={styles.graphWrapper} ref={wrapperRef}></div>;
  }
);
