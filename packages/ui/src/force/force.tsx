import { useLayoutEffect, useRef } from "react";
import ForceImpl from "./impl";
import styles from "./index.module.scss";

const Force = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const forceImpl = useRef(new ForceImpl());

  useLayoutEffect(() => {
    if (containerRef.current) {
      forceImpl.current.mount(containerRef.current);
    } else if (forceImpl.current) {
      forceImpl.current.umount();
    }

    return () => {
      forceImpl.current.umount();
    };
  }, []);

  return <div className={styles.forceContainer} ref={containerRef}></div>;
};

export default Force;
