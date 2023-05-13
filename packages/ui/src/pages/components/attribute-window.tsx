import { CloseOutlined } from "@ant-design/icons";
import { useUpdateEffect } from "ahooks";
import { Col, Row, Tag } from "antd";
import { useState } from "react";
import graphStore from "../../stores/graph";
import settingStore from "../../stores/setting";
import styles from "./components.module.scss";
const AttributeWindow = () => {
  const { currentBase } = graphStore;
  const { displayAttribute } = settingStore;
  const [display, setDisplay] = useState(true);

  useUpdateEffect(() => {
    if (currentBase) {
      setDisplay(true);
    }
  }, [currentBase]);

  if (!display || !currentBase || !displayAttribute) {
    return null;
  }
  const isNode = !!currentBase.schema_name;

  return (
    <section className={styles.attributeContainer}>
      <div className={styles.attributeHeader}>
        <CloseOutlined
          style={{
            color: "black",
            cursor: "pointer",
          }}
          onClick={() => {
            setDisplay(false);
          }}
        />
      </div>
      <Row className={styles.attributeContent}>
        {isNode ? (
          <>
            <Col style={{ fontSize: "1.4em", textAlign: "right" }} span={8}>
              知识点名称：
            </Col>
            <Col style={{ fontSize: "1.4em" }} span={16}>
              {currentBase.name}
            </Col>
            <Col style={{ fontSize: "1.4em", textAlign: "right" }} span={8}>
              知识点分类：
            </Col>
            <Col style={{ fontSize: "1.4em" }} span={16}>
              {currentBase.schema_name}
            </Col>
          </>
        ) : (
          <>
            <Col span={24}>
              从知识点
              <Tag color="green">{currentBase.source?.name}</Tag>到知识点
              <Tag color="green">知识点：{currentBase.target.name}</Tag>的关系：
              <Tag color="magenta">{currentBase.name}</Tag>
            </Col>
          </>
        )}
      </Row>
    </section>
  );
};

export default AttributeWindow;
