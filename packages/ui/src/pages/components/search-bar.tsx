import { Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  KBarPortal,
  KBarAnimator,
  KBarSearch,
  KBarPositioner,
  KBarResults,
  useMatches,
  useKBar,
} from "kbar";
import styles from "./components.module.scss";

export const SearchBar = () => {
  // const results: any[] = [];
  const kbar = useKBar();

  return (
    <>
      <Button
        className={styles.searchInput}
        onClick={() => {
          kbar.query.toggle();
          // console.log(kbar)
        }}
      >
        <SearchOutlined />
        Press `cmd + k` to start search domain
      </Button>
      <KBarPortal>
        <KBarPositioner>
          <KBarAnimator>
            <KBarSearch />
            <SearchResult />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
    </>
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
          >
            {item.name}
          </div>
        )
      }
    ></KBarResults>
  );
};
