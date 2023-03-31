import resso from "resso"
import type { ForceNodeType, ForceLinkType } from '@model'

const forceStore = resso<{
  selectBase?: ForceNodeType | ForceLinkType
}>({})

export default forceStore
