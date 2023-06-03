import { Modal, notification, Spin, Form, Input } from "antd";
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { KBarProvider } from "kbar";

import styles from "./index.module.scss";
import { SearchBar } from "./components/search-bar";
import GraphSelector from "./components/graph-selector";
import graphStore from "../stores/graph";
import SettingDrawer from "./components/setting-drawer";
import SuffixHeaderButtons from "./components/suffix-header-buttons";
import UpdateWindow from "./components/update-window";
import AttributeWindow from "./components/attribute-window";
import { EchartsGraph } from "./components/echarts-graph";

export const IndexPage = () => {
  const barRef = useRef<{
    setOnOpen: VoidFunction;
  }>(null);
  const { graphName, isPulling } =
    graphStore;

  const warpperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<InputPromptRef>(null);

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
              <EchartsGraph inputRef={inputRef} />
              {/* <Force */}
              {/*   option={{ */}
              {/*     width: forceSize.width, */}
              {/*     height: forceSize.height, */}
              {/*   }} */}
              {/*   data={data} */}
              {/*   nodeStateStyles={NODE_STATE_STYLES as any} */}
              {/*   lockedNode={lockedNode ?? undefined} */}
              {/*   linkStateStyles={LINK_STATE_STYLES} */}
              {/*   {...forceBehaviors} */}
              {/* /> */}
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

const InputPrompt = forwardRef<InputPromptRef, {}>(({ }, ref) => {
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
          .catch(() => {
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

