import { Modal, notification, Spin, Form, Input } from "antd";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { KBarProvider } from "kbar";
import { Force, IGraphProps } from "@bixi-design/graphs";

import styles from "./index.module.scss";
import { SearchBar } from "./components/search-bar";
import GraphSelector from "./components/graph-selector";
import graphStore from "../stores/graph";
import SettingDrawer from "./components/setting-drawer";
import SuffixHeaderButtons from "./components/suffix-header-buttons";
import UpdateWindow from "./components/update-window";
import { createLink } from "../api/link";
import AttributeWindow from "./components/attribute-window";

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
  const { graphName, nodes, links, isPulling, lockedNode, pollGraph } =
    graphStore;
  const data = useMemo(
    () => ({
      nodes,
      links,
    }),
    [nodes, links]
  );
  const clickRef = useRef<number>();

  const forceBehaviors: Pick<
    IGraphProps,
    | "onNodeClick"
    | "onLinkClick"
    | "onNodeDbClick"
    | "onLinkDbClick"
    | "onCanvasClick"
    | "contextmenuNodePopover"
    | "onNodeHover"
  > = {
    onNodeClick: async (n) => {
      if (lockedNode) {
        if (lockedNode.id === n.id) {
          notification.error({
            placement: "bottomRight",
            message: "选中的两个节点不能为同一节点",
          });
          return;
        }
        const from = lockedNode,
          to = n;
        try {
          const name: string = (await inputRef.current!.getInputName()) as any;
          await createLink(graphName!, {
            from: from.id,
            to: to.id,
            name,
          });
          pollGraph();
          graphStore.lockedNode = null;
        } catch {}
      } else {
        graphStore.currentBase = n;
      }
    },
    onLinkClick: (l) => {
      if (clickRef.current) {
        clearTimeout(clickRef.current);
        graphStore.updateBase = l;
        clickRef.current = undefined;
      } else {
        clickRef.current = setTimeout(() => {
          graphStore.currentBase = l;
          clickRef.current = undefined;
        }, 400);
      }
    },
    onNodeDbClick: (n) => {
      graphStore.updateBase = n;
    },
    onCanvasClick: (d) => {
      if (!d) {
        graphStore.currentBase = null;
      }
    },
  };
  const warpperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<InputPromptRef>(null);

  const [forceSize, setForceSize] = useState(() => {
    const container = warpperRef.current;
    return {
      width: container?.clientWidth || 0,
      height: container?.clientHeight || 0,
    };
  });
  useResize("resize", () => {
    const container = warpperRef.current;
    setForceSize({
      width: container?.clientWidth || 0,
      height: container?.clientHeight || 0,
    });
  });

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
        <AttributeWindow />
        <GraphSelector />
        <section className={styles.viewContainer}>
          <div className={styles.searchHeader}>
            <span className={styles.graphName}>
              {graphName ? `当前图谱：${graphName}` : "未选择图谱"}
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
            <div className={styles.forceWrapper} ref={warpperRef}>
              <Force
                option={{
                  width: forceSize.width,
                  height: forceSize.height,
                }}
                data={data}
                nodeStateStyles={NODE_STATE_STYLES}
                lockedNode={lockedNode ?? undefined}
                {...forceBehaviors}
              />
            </div>
          )}
        </section>
      </main>
      <SettingDrawer />
      <UpdateWindow />
      <InputPrompt ref={inputRef} />
    </KBarProvider>
  );
};

function initialPromise() {
  let res_: (value: unknown) => void, rej_: (r: any) => void;
  const _p = new Promise((res, rej) => {
    res_ = res;
    rej_ = rej;
  });

  return {
    status: _p,
    // @ts-ignore
    rej: rej_,
    // @ts-ignore
    res: res_,
  };
}
type InputPromptRef = {
  getInputName: () => Promise<unknown>;
};

const InputPrompt = forwardRef<InputPromptRef, {}>(({}, ref) => {
  const [open, setOpen] = useState(false);
  const promiseRef = useRef(initialPromise());
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    getInputName() {
      setOpen(true);
      return promiseRef.current.status;
    },
  }));
  return (
    <Modal
      open={open}
      onOk={() => {
        form
          .validateFields()
          .then((value) => {
            const { name = "" } = value;
            promiseRef.current.res(name);
            setOpen(false);
        setTimeout(() => {
          promiseRef.current = initialPromise();
        }, 100);
          })
          .catch((err) => {
            notification.error({
              placement: "bottomRight",
              message: "请输入关系名称",
            });
          });
      }}
      onCancel={() => {
        promiseRef.current.rej("");

        setOpen(false);
        setTimeout(() => {
          promiseRef.current = initialPromise();
        }, 100);
      }}
      title="创建新关系"
    >
      <Form form={form}>
        <Form.Item
          // rules={[
          //   {
          //     required: true,
          //   },
          // ]}
          name="name"
        >
          <Input placeholder="请输入关系名称" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

const useResize = (ev: string, handler: EventListenerOrEventListenerObject) => {
  const handlerRef = useRef<EventListenerOrEventListenerObject | undefined>(
    undefined
  );

  useEffect(() => {
    if (handlerRef.current) {
      window.removeEventListener(ev, handler);
    }
    handlerRef.current = handler;
    window.addEventListener(ev, handler);
  }, [ev]);

  return () => {
    window.removeEventListener(ev, handler);
  };
};
