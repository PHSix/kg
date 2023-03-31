import { createContext } from "react";
import { ForceLinkType, ForceNodeType } from "../../../kg-model";

export const forceContext = createContext<{
  select: (base: ForceLinkType | ForceNodeType) => void;
}>(null!);

const Provider = forceContext.Provider;

export default Provider;
