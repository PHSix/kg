import { FC, PropsWithChildren } from "react";
import { CurrentDomainProvider } from "./currentDomain";

export const StoreProvider: FC<PropsWithChildren<{}>> = (props) => {
  return <CurrentDomainProvider>{props.children}</CurrentDomainProvider>;
};
