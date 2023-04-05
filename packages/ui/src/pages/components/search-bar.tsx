import { Button, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { forwardRef, useImperativeHandle, useMemo } from "react";
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
import { getNode } from "../../api/node";

export const SearchBar = forwardRef<{
  setOnOpen: () => void;
}>((_, ref) => {
  const { query, searchValue } = useKBar((state) => ({
    searchValue: state.searchQuery,
  }));

  const { graphName } = graphStore;

  let wrapper = {
    clear: () => {},
  };

  const getNodeDomain = (graph: string, id?: string) => {
    return getNode(graph, id).then((response) => {
      graphStore.nodes = response.data.data.nodes;
      graphStore.links = response.data.data.links;
    });
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
                  getNodeDomain(graphName, record.id);
                },
              } as Action)
          )
          .concat({
            name: "The Whole Graph",
            id: "the_whole_graph",
            perform: () => {
              getNodeDomain(graphName);
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
        Press `cmd + k` to start search node
      </Button>
      <KBarPortal>
        <KBarPositioner>
          <KBarAnimator className={styles.kbarAnimator}>
            <KBarSearch
              className={styles.kbarSearchInput}
              defaultPlaceholder="Type graph's node for search"
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
