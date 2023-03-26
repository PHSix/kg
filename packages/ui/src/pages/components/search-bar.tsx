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
import domainStore from "../../stores/domain";
import request from "../../utils/request";
import { useActions } from "./useActions";

export const SearchBar = forwardRef<{
  setOnOpen: () => void;
}>((_, ref) => {
  const { query, searchValue } = useKBar((state) => ({
    searchValue: state.searchQuery,
  }));

  const { graphName } = domainStore;
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
        const repsonse = await request.get("/api/domain/node", {
          params: {
            graph: graphName,
          },
        });
        const data: any[] = repsonse.data.data;

        wrapper.clear();

        return data
          .map((record) => ({
            name: record.properties.name,
            id: record.id,
            perform: () => {},
          } as Action))
          .concat({
            name: "The Whole Graph",
            id: "the_whole_graph",
            perform: () => {},
            priority: 999
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
      >
        <SearchOutlined />
        Press `cmd + k` to start search node
      </Button>
      <KBarPortal>
        <KBarPositioner>
          <KBarAnimator className={styles.kbarAnimator}>
            <KBarSearch
              className={styles.kbarSearchInput}
              defaultPlaceholder="Type domain node for search"
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
