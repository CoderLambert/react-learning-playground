import { canonicalQuestion } from "./factory.js";

export const STATE_DRY_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-state-dry-derived-value",
    learningUnitId: "state-dry",
    difficulty: "easy",
    conceptTags: ["state-shape", "derived-state"],
    content: {
      prompt: "fullName 能由当前 firstName + lastName 完整计算。最合适的建模是什么？",
      options: [
        { id: "derive", text: "在 render 中直接派生 fullName，不额外保存同义 State" },
        { id: "copy-state", text: "再保存 fullName State，并要求每条路径手动同步" },
        { id: "effect-copy", text: "保存 fullName State，再用 Effect 持续同步" },
        { id: "dom-source", text: "让 DOM 成为 fullName 的事实来源" },
      ],
      correctOptionId: "derive",
      explanation: "可由现有 props/state 完整得到的值不是独立事实。直接派生能删除同步不变量。",
      diagnosticOptionMap: {
        "copy-state": "derived-value-needs-state",
        "effect-copy": "effect-fixes-duplicate-state",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "StateDryDemo.jsx", startLine: 45, endLine: 49 }],
  }),
  canonicalQuestion({
    id: "canonical-state-dry-exclusive-status",
    learningUnitId: "state-dry",
    difficulty: "medium",
    conceptTags: ["state-shape", "status"],
    content: {
      prompt: "业务只允许 typing → sending → sent。为什么一个 status 通常比 isSending + isSent 两个独立 boolean 更可靠？",
      options: [
        { id: "legal-state-space", text: "status 只枚举合法阶段，避免 isSending=true 且 isSent=true 这类非法组合" },
        { id: "fewer-renders", text: "因为一个字符串保证 React 永远只 render 一次" },
        { id: "no-state", text: "因为 status 不属于 State" },
        { id: "deep-copy", text: "因为字符串会自动深复制其他 State" },
      ],
      correctOptionId: "legal-state-space",
      explanation: "State shape 决定可表示的状态集合。互斥阶段用枚举值能直接排除一部分矛盾组合。",
      diagnosticOptionMap: {
        "fewer-renders": "booleans-are-always-simpler",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "StateDryDemo.jsx", startLine: 51, endLine: 54 }],
  }),
  canonicalQuestion({
    id: "canonical-state-dry-selected-id",
    learningUnitId: "state-dry",
    difficulty: "medium",
    conceptTags: ["state-shape", "entity"],
    content: {
      prompt: "cartItems 是权威商品集合。选择一个商品时，为什么保存 selectedId 往往比保存 selectedCopy 更稳？",
      options: [
        { id: "derive-current-entity", text: "selectedId 是独立选择事实；当前实体可从最新 cartItems 派生，不会留下过期对象副本" },
        { id: "copy-faster", text: "对象副本一定比 id 查询更慢，所以永远禁止保存对象" },
        { id: "id-global", text: "React 只允许数字进入 State" },
        { id: "copy-auto-sync", text: "selectedCopy 会自动跟随 cartItems 中对应对象更新" },
      ],
      correctOptionId: "derive-current-entity",
      explanation: "同一实体内容应尽量只有一个 canonical source。选择关系通常保存 id，再从最新 collection 查实体。",
      diagnosticOptionMap: {
        "copy-auto-sync": "copy-entity-is-selection",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "StateDryDemo.jsx", startLine: 56, endLine: 63 }],
  }),
  canonicalQuestion({
    id: "canonical-state-dry-transfer",
    learningUnitId: "state-dry",
    difficulty: "medium",
    conceptTags: ["state-shape", "transfer"],
    content: {
      prompt: "下面哪一项最应该从 State 中移除？",
      codeContext: {
        label: "陌生代码 · Checkout.jsx",
        language: "jsx",
        code: `const [price, setPrice] = useState(100);
const [quantity, setQuantity] = useState(2);
const [total, setTotal] = useState(200);

useEffect(() => {
  setTotal(price * quantity);
}, [price, quantity]);`,
      },
      options: [
        { id: "remove-total", text: "移除 total State / Effect，直接 const total = price * quantity" },
        { id: "remove-price", text: "移除 price，因为所有数字都应该派生" },
        { id: "remove-quantity", text: "移除 quantity，因为 useState 不能保存数字" },
        { id: "keep-all", text: "三份 State 都必须保留，Effect 是唯一正确同步方式" },
      ],
      correctOptionId: "remove-total",
      explanation: "total 完全由当前 price 和 quantity 决定，不是独立事实。",
      diagnosticOptionMap: {
        "keep-all": "effect-fixes-duplicate-state",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "StateDryDemo.jsx", startLine: 45, endLine: 49 }],
  }),
  canonicalQuestion({
    id: "canonical-state-dry-minimal-facts",
    learningUnitId: "state-dry",
    difficulty: "hard",
    conceptTags: ["state-shape", "ownership"],
    content: {
      prompt: "“State 只保存最小事实集合”最准确的含义是什么？",
      options: [
        { id: "independent-facts", text: "保存无法从其他当前输入完整推出的独立事实；派生值在 render 计算，重复实体只保存必要关系" },
        { id: "one-hook", text: "整个组件只能有一个 useState" },
        { id: "flat-only", text: "所有对象都必须扁平化成字符串" },
        { id: "no-arrays", text: "数组不能放进 State" },
      ],
      correctOptionId: "independent-facts",
      explanation: "最小事实集合不是 API 数量限制，而是减少重复事实与需要人工维护的不变量。",
      diagnosticOptionMap: {},
    },
    evidenceRefs: [{ kind: "source", fileName: "StateDryDemo.jsx", startLine: 45, endLine: 66 }],
  }),
]);
