import { CloseOutlined } from "@ant-design/icons";
import { useUpdateEffect } from "ahooks";
import { Col, Row } from "antd";
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

  return (
    <section className={styles.attributeContainer}>
      <div className={styles.attributeHeader}>
      <div>属性窗口</div>
        <CloseOutlined
          className={styles.attributeClose}
          onClick={() => {
            setDisplay(false);
          }}
        ></CloseOutlined>
      </div>
      <div className={styles.attributeBody}>
        <Row className={styles.attributeRow}>
          <Col className={styles.attributeKey} span={6}>
            Name:
          </Col>
          <Col className={styles.attributeValue}>{currentBase?.name}</Col>
        </Row>

        {currentBase?.schema_name && (
          <Row className={styles.attributeRow}>
            <Col className={styles.attributeKey} span={6}>
              Group:
            </Col>
            <Col className={styles.attributeValue}>
              {currentBase?.schema_name}
            </Col>
          </Row>
        )}
      </div>
    </section>
  );
};

export default AttributeWindow;
