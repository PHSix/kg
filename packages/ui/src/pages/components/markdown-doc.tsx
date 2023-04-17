import styles from "./components.module.scss";
import ReactMarkdown from "react-markdown";
import { FC } from "react";
import { useMount, useUpdate } from "ahooks";
let mdText = "";

const MarkdownDoc: FC<{
  text?: string;
}> = ({ text = "" }) => {
  const update = useUpdate();
  useMount(() => {
    if (mdText.length === 0)
      fetch("/public/help.md")
        .then((res) => {
          return res.text();
        })
        .then((t) => {
          mdText = t;
          update();
        });
  });
  return (
    <section className={styles.markdownWrapper}>
      <ReactMarkdown>{mdText}</ReactMarkdown>
    </section>
  );
};

export default MarkdownDoc;
