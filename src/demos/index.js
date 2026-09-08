import { PropsBasicsDemo } from "./PropsBasicsDemo";
import { ChildrenSlotDemo } from "./ChildrenSlotDemo";
import { MultiSlotsDemo } from "./MultiSlotsDemo";
import { StateDryDemo } from "./StateDryDemo";
// @demo-imports

export const demos = [
  {
    id: "props",
    label: "📌 1. Props 基础与解构",
    Component: PropsBasicsDemo,
  },
  {
    id: "children",
    label: "📦 2. Children 默认插槽",
    Component: ChildrenSlotDemo,
  },
  {
    id: "multi-slots",
    label: "🧩 3. 具名多插槽客制化",
    Component: MultiSlotsDemo,
  },
  {
    id: "state-dry",
    label: "🧪 状态干净原则",
    Component: StateDryDemo,
  },
  // @demo-entries
];
