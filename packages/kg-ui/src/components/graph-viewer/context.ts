import {ForceNodeType} from "kg-model";
import {createContext} from "react";

interface ViewerContext {
  onAppendNodeOk: (node: ForceNodeType) => void;
}

export const viewerContext = createContext<ViewerContext>(null!);

export const ViewerProvider = viewerContext.Provider;

