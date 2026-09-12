var e=`# State 结构设计：减少可以表示的错误状态

State shape 首先是正确性设计。一个值能不能放进 \`useState\` 不是关键；关键是：**保存它以后，是否新增了需要人为维持的一致性约束？**

<MentalModel title="State 只保存最小事实集合">
如果一个值能由现有 props/state 完整计算出来，就优先在 render 中派生；如果两个字段必须永远同步，通常意味着它们在重复表达同一事实；如果多个 boolean 共同描述一个互斥流程，通常应该收敛成一个有限状态值。

减少冗余 State 的直接收益不是“更 DRY”，而是缩小组件可以表示的状态空间，让一部分错误状态根本没有机会出现。
</MentalModel>

## 先看一个更具体的问题：为什么重复 State 危险？

假设姓名同时保存为：

\`\`\`js
firstName = "张"
lastName = "三丰"
storedFullName = "张 三丰"
\`\`\`

这三个值之间存在一个额外不变量：

\`\`\`text
storedFullName === firstName + " " + lastName
\`\`\`

React 不会替你维护这个不变量。只要某条更新路径改了 \`firstName\` / \`lastName\`，却忘记同步 \`storedFullName\`，组件就进入“两个答案都声称自己是真的”的状态。

如果 \`fullName\` 直接由前两个值派生：

\`\`\`js
const fullName = \`\${firstName} \${lastName}\`.trim();
\`\`\`

这个不一致状态就不再是“比较难出现”，而是**无法表示**。

<Experiment title="实验 1：亲手制造 stale derived state">
在中间 Demo 的“冗余 State”区域：

1. 点击“只改事实来源，故意漏同步”。
2. 观察 \`storedFullName\` 仍是旧值，而 \`derivedFullName\` 已经变化。
3. 再点“手动同步副本”，观察错误状态暂时消失。

关键不是“记得同步就好了”，而是为什么要让正确性依赖每条未来更新路径都记得同步。
</Experiment>

## 矛盾 State：字段越多，可组合状态通常越多

两个 boolean：

\`\`\`js
isSending
isSent
\`\`\`

一共能表达 4 种组合：

\`\`\`text
false false
true  false
false true
true  true
\`\`\`

如果业务只允许 \`typing → sending → sent\`，那么 \`true + true\` 就是模型允许、业务却不允许的状态。

更适合的模型是：

\`\`\`js
status = "typing" | "sending" | "sent"
\`\`\`

这里不是说 boolean 不好，而是：**如果多个 boolean 在共同描述同一个互斥状态机，它们很容易产生非法组合。**

<Experiment title="实验 2：制造业务上不可能的 boolean 组合">
在 Demo 中分别勾选 \`isSending\` 和 \`isSent\`，把两者同时设为 \`true\`。右侧再用 \`status\` 切换 \`typing / sending / sent\`，比较两种模型能表示的状态集合。
</Experiment>

## 重复实体：对象副本为什么容易过期？

常见模型：

\`\`\`js
const [items, setItems] = useState(...);
const [selectedItem, setSelectedItem] = useState(items[0]);
\`\`\`

此时同一个商品同时存在于：

\`\`\`text
items[index]
selectedItem
\`\`\`

更新 \`items[index].count\` 并不会自动更新 \`selectedItem\`。如果两份对象都被当成事实来源，就出现 stale copy。

更稳的模型通常是只保存：

\`\`\`js
const [selectedId, setSelectedId] = useState(1);
const selectedItem = items.find(item => item.id === selectedId) ?? null;
\`\`\`

这里 \`selectedId\` 是新的独立事实，“当前实体内容”仍只有 \`items\` 一份权威来源。

<Experiment title="实验 3：让 selected object 副本过期">
先选择一个商品，然后修改它的数量。Demo 左侧故意保存的 \`selectedCopy\` 不会自动变化；右侧通过 \`selectedId\` 从 \`cartItems\` 查出的实体会立即反映最新数量。
</Experiment>

## 单一数据源不等于“只能有一个 useState”

不要把这个原则误解成：

\`\`\`text
所有状态必须塞进一个巨大对象
\`\`\`

相互独立的事实完全可以分别保存：

\`\`\`js
const [query, setQuery] = useState("");
const [page, setPage] = useState(1);
\`\`\`

真正需要检查的是：

- 两个字段是否在重复表达同一事实？
- 一个字段是否能从其他字段可靠推导？
- 多个字段是否必须通过额外同步逻辑才能保持一致？
- 某种字段组合是否代表业务上的不可能状态？

<Boundary title="派生值昂贵，不代表它就应该变成 State">
“是否需要保存为 State”和“计算是否昂贵”是两个不同问题。纯派生数据仍然属于 render 模型；如果真实测量表明计算昂贵，可以再考虑 memoization，而不是先复制一份 State 再用 Effect 同步。
</Boundary>

## 深层结构也不是越扁平越好

Demo 最后一部分使用 \`id → entity\` 映射展示 normalization，因为共享实体、深层更新和局部关系修改在扁平结构下更容易处理。

但如果对象层级很浅，并且天然作为一个整体一起更新：

\`\`\`js
const [position, setPosition] = useState({ x: 0, y: 0 });
\`\`\`

继续保持对象结构往往更清晰。

目标始终是降低更新复杂度和错误概率，而不是追求某种固定 State 形状。

## 项目里的判断顺序

遇到一个准备放进 State 的值，可以按下面顺序检查：

1. **它能否由现有 props/state 完整计算？** 能就先派生。
2. **它是否只是另一份事实的副本？** 是就优先保存 ID / key / canonical collection，而不是复制实体。
3. **多个字段是否必须永远同步？** 是就重新检查 State shape。
4. **多个 boolean 是否共同描述互斥流程？** 是就考虑枚举状态或 reducer/state machine。
5. **结构是否因为深层更新或共享引用变得难维护？** 真正出现这个问题时再考虑 normalization。

<AntiPattern title="用 Effect 修补错误 State shape">
如果 \`fullName\` 能直接从 \`firstName + lastName\` 得到，却保存第三份 \`fullName\` State 再用 Effect 同步，本质上是在用运行时同步逻辑维护本可以由数据模型消除的不变量。Effect 不是修复冗余 State 的首选工具。
</AntiPattern>

<Summary>
- State shape 决定组件能表示哪些状态，包括哪些错误状态。
- 可派生数据优先在 render 中计算。
- 同一实体尽量只保留一个 canonical source；选择关系通常保存 ID。
- 互斥流程不要用一组彼此独立的 boolean 随意组合。
- 单一数据源不是“一个 useState”，normalization 也不是越扁平越好。
</Summary>

<FurtherReading items={[{ label: "React: Choosing the State Structure", href: "https://react.dev/learn/choosing-the-state-structure" }, { label: "React: You Might Not Need an Effect", href: "https://react.dev/learn/you-might-not-need-an-effect" }]} />`;export{e as default};