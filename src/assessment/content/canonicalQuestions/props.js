import { canonicalQuestion } from "./factory.js";

export const PROPS_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-props-ownership",
    learningUnitId: "props",
    difficulty: "easy",
    conceptTags: ["props", "ownership"],
    content: {
      prompt: "子组件收到 name prop 后，谁应该拥有并发起这个 name 源数据的更新？",
      options: [
        { id: "owner", text: "保存源数据的上层所有者；子组件通过当前 Props 读取结果" },
        { id: "child-mutates", text: "子组件直接修改 props.name" },
        { id: "react-global", text: "React 自动把所有 Props 放进全局可变对象" },
        { id: "dom", text: "DOM input 自己成为 name 的唯一数据所有者" },
      ],
      correctOptionId: "owner",
      explanation: "Props 是父级给当前 render 的输入。需要改变源数据时，应回到真正的状态所有者或通过回调请求更新。",
      diagnosticOptionMap: {
        "child-mutates": "props-owned-by-child",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "PropsBasicsDemo.jsx", startLine: 70, endLine: 108 }],
  }),
  canonicalQuestion({
    id: "canonical-props-default-undefined",
    learningUnitId: "props",
    difficulty: "medium",
    conceptTags: ["props", "default-parameter"],
    content: {
      prompt: "UserCard({ role = '普通成员' }) 中，哪种输入会触发这个 JavaScript 默认值？",
      options: [
        { id: "undefined", text: "role 被省略或显式为 undefined" },
        { id: "null", text: "role={null}" },
        { id: "empty-string", text: "role=''" },
        { id: "false", text: "role={false}" },
      ],
      correctOptionId: "undefined",
      explanation: "参数/解构默认值只在对应值为 undefined 时生效；null、空字符串和 false 都是已经显式提供的值。",
      diagnosticOptionMap: {
        null: "default-applies-to-null",
        "empty-string": "default-applies-to-null",
        false: "default-applies-to-null",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "UserCard.jsx", startLine: 5, endLine: 7 }],
  }),
  canonicalQuestion({
    id: "canonical-props-derived-transfer",
    learningUnitId: "props",
    difficulty: "medium",
    conceptTags: ["props", "derived-value", "transfer"],
    content: {
      prompt: "下面 subtotal 完全由当前 price 和 quantity 决定。哪种实现最符合本节数据流？",
      codeContext: {
        label: "陌生代码 · CartLine.jsx",
        language: "jsx",
        code: `function CartLine({ price, quantity }) {
  const [subtotal, setSubtotal] = useState(price * quantity);

  useEffect(() => {
    setSubtotal(price * quantity);
  }, [price, quantity]);

  return <span>{subtotal}</span>;
}`,
      },
      options: [
        { id: "derive", text: "删除 subtotal State/Effect，在 render 中 const subtotal = price * quantity" },
        { id: "keep-effect", text: "保留 Effect，因为任何 Props 变化都必须先同步到 State" },
        { id: "mutate-price", text: "直接执行 price *= quantity，再显示 price" },
        { id: "empty-deps", text: "保留 Effect 但把依赖改成 []，避免重复执行" },
      ],
      correctOptionId: "derive",
      explanation: "subtotal 没有独立事实来源，只是当前 props 的函数。直接派生更简单，也不存在同步滞后。",
      diagnosticOptionMap: {
        "keep-effect": "derived-value-needs-state",
        "mutate-price": "props-owned-by-child",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ProductCard.jsx", startLine: 5, endLine: 9 }],
  }),
  canonicalQuestion({
    id: "canonical-props-spread",
    learningUnitId: "props",
    difficulty: "medium",
    conceptTags: ["props", "spread"],
    content: {
      prompt: "<UserCard {...adminData} /> 最准确的理解是什么？",
      options: [
        { id: "explicit-properties", text: "把 adminData 的属性作为普通 Props 传入；它不会改变 Props 的只读/单向数据流语义" },
        { id: "shared-object", text: "UserCard 获得 adminData 的所有权，可以随意修改父级对象" },
        { id: "context", text: "spread 会自动创建 Context Provider" },
        { id: "state-copy", text: "React 自动为每个字段创建一份子组件 State" },
      ],
      correctOptionId: "explicit-properties",
      explanation: "JSX spread 只是传 Props 的语法便利，数据所有权与单向流动没有因此改变。",
      diagnosticOptionMap: {
        "shared-object": "props-owned-by-child",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "PropsBasicsDemo.jsx", startLine: 139, endLine: 143 }],
  }),
  canonicalQuestion({
    id: "canonical-props-derived-vs-state",
    learningUnitId: "props",
    difficulty: "hard",
    conceptTags: ["props", "single-source-of-truth"],
    content: {
      prompt: "什么时候更有理由把一个值存进子组件 State，而不是每次从 Props 直接计算？",
      options: [
        { id: "independent-fact", text: "它代表子组件自身会独立变化、不能仅由当前 Props 完全推导的事实" },
        { id: "any-calculation", text: "只要计算包含乘法或 map，就必须存 State" },
        { id: "performance-always", text: "所有派生值先存 State 都会更快" },
        { id: "prop-readonly", text: "因为 Props 只读，所以任何显示值都必须复制到 State" },
      ],
      correctOptionId: "independent-fact",
      explanation: "State 应保存独立变化的事实。完全可由当前输入推导的值复制进 State 只会增加同步责任。",
      diagnosticOptionMap: {
        "any-calculation": "derived-value-needs-state",
        "prop-readonly": "derived-value-needs-state",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ProductCard.jsx", startLine: 5, endLine: 9 }],
  }),
]);
