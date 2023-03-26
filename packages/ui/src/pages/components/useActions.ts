import * as React from "react";
import { useKBar, Action } from "kbar";

export function useActions(
  actions: Action[],
  dependencies: React.DependencyList = []
) {
  const { query } = useKBar();
  const unregisterRef = React.useRef(() => {});

  const actionsCache = React.useMemo(() => actions, dependencies);

  React.useEffect(() => {
    if (!actionsCache.length) {
      return;
    }

    const unregister = query.registerActions(actionsCache);
    unregisterRef.current = unregister;
    return () => {
      unregister();
    };
  }, [query, actionsCache]);

  return unregisterRef;
}

