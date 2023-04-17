import { Button, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { forwardRef, useImperativeHandle } from "react";
import { useRequest } from "ahooks";
import {
  KBarPortal,
  KBarAnimator,
  KBarSearch,
  KBarPositioner,
  KBarResults,
  useMatches,
  useKBar,
  Action,
} from "kbar";

import styles from "./components.module.scss";
import graphStore from "../../stores/graph";
import request from "../../utils/request";
import { useActions } from "./useActions";

export const SearchBar = forwardRef<{
  setOnOpen: () => void;
}>((_, ref) => {
  const { query } = useKBar(() => ({}));

  const { graphName, pollGraph } = graphStore;

  let wrapper = {
    clear: () => {},
  };

  const {
    data: _actions,
    refresh,
    loading,
  } = useRequest<Action[], any[]>(
    async () => {
      if (!graphName) return [];
      try {
        const response = await request.get("/api/graph/node", {
          params: {
            graph: graphName,
          },
        });
        const data: any[] = response.data.data;

        wrapper.clear();

        return data
          .map(
            (record) =>
              ({
                name: record.properties.name,
                id: record.id,
                perform: () => {
                  graphStore.searchNodeId = record.id;
                  pollGraph();
                },
              } as Action)
          )
          .concat({
            name: "获得整个图谱",
            id: "the_whole_graph",
            perform: () => {
              graphStore.searchNodeId = null;
              pollGraph();
            },
            priority: 999,
          });
      } catch (err) {
        console.error(err);
        return [];
      }
    },
    {
      manual: true,
    }
  );
  useImperativeHandle(ref, () => ({
    setOnOpen: () => {
      refresh();
    },
  }));
  wrapper.clear = useActions(loading ? [] : _actions || [], [_actions]).current;

  return (
    <>
      <Button
        className={styles.searchButton}
        onClick={() => {
          query.toggle();
          refresh();
        }}
        disabled={!graphName}
      >
        <SearchOutlined />
        按下 `cmd + k` 开始搜索图谱节点
        {/* Press `cmd + k` to start search node */}
      </Button>
      <KBarPortal>
        <KBarPositioner
          style={{
            zIndex: 1000,
          }}
        >
          <KBarAnimator className={styles.kbarAnimator}>
            <KBarSearch
              className={styles.kbarSearchInput}
              defaultPlaceholder="输入名字来搜索图谱节点"
            />
            {loading || !_actions ? <LoadingAnimate /> : <SearchResult />}
            <KBarBottom />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
    </>
  );
});

const KBarBottom = () => {
  const { results } = useMatches();
  return (
    <div className={styles.kbarBottom}>
      {results.length === 0 && (
        <div className={styles.kbarBottomContainer}>
          <span>Not Search Results</span>
        </div>
      )}
    </div>
  );
};

const LoadingAnimate = () => {
  return (
    <div className={styles.loadingWrapper}>
      <Spin spinning={true}></Spin>;
    </div>
  );
};

const SearchResult = () => {
  const { results } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div>{item}</div>
        ) : (
          <div
            style={{
              background: active ? "#eee" : "transparent",
            }}
            className={styles.kbarResultRecord}
          >
            {item.name}
          </div>
        )
      }
    ></KBarResults>
  );
};
