import * as echarts from "echarts";
import { FC, useEffect, useRef } from "react";

export const EchartsGraph: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const graphRef = useRef<echarts.ECharts>();
  useEffect(() => {
    ref.current && (graphRef.current = echarts.init(ref.current));
    return () => {
      graphRef.current?.dispose();
    };
  }, []);
  return <div className="echart-graph" ref={ref}></div>;
};
