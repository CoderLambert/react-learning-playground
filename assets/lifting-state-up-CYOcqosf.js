import{v as e,w as t}from"./index-B1LhOmwb.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,h2:`h2`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,FurtherReading:l,MentalModel:u,Summary:d}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`FurtherReading`,!0),u||a(`MentalModel`,!0),d||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`状态提升让需要协同的组件共享同一个事实`,children:`状态提升：让需要协同的组件共享同一个事实`}),`
`,(0,n.jsxs)(r.p,{children:[`当多个组件必须基于同一份信息保持一致时，问题通常不是“怎么让兄弟组件互相通知”，而是：`,(0,n.jsx)(r.strong,{children:`这份事实应该由谁拥有？`})]}),`
`,(0,n.jsxs)(u,{title:`把共享事实放到需要协调它的最近共同 owner`,children:[(0,n.jsx)(r.p,{children:`如果多个子组件都要读取或影响同一份状态，通常把这份 state 放到它们最近的共同父节点：父级保存权威值，通过 props 向下传数据，通过 callback 接收子组件表达的用户意图。`}),(0,n.jsx)(r.p,{children:`状态提升的目的不是把 state 搬得越高越好，而是给“必须一致的那份事实”找到一个唯一、足够近的 owner。`})]}),`
`,(0,n.jsx)(r.h2,{id:`demo-中真正发生了什么`,children:`Demo 中真正发生了什么`}),`
`,(0,n.jsxs)(r.p,{children:[`当前 Demo 的共享事实是搜索条件 `,(0,n.jsx)(r.code,{children:`query`}),`：`]}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-text`,children:`LiftingStateUpDemo owns query
        │
        ├── value / onChange → SearchBox
        ├── query + count   → SearchSummary
        └── query + results → FrameworkList
`})}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`SearchBox`}),` 不需要知道 Summary 或 List 的存在。它只做两件事：`]}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-text`,children:`显示父级给它的 value
用户输入时调用 onChange(nextValue)
`})}),`
`,(0,n.jsxs)(r.p,{children:[`父级接受这次意图并更新 `,(0,n.jsx)(r.code,{children:`query`}),` 后，下一次 render 会把新的 `,(0,n.jsx)(r.code,{children:`query`}),` 同时传给所有依赖它的子组件。因此兄弟组件之间不需要建立第二条“横向同步”通道。`]}),`
`,(0,n.jsxs)(c,{title:`实验：从一个子组件改变共享事实`,children:[(0,n.jsxs)(r.p,{children:[`在中间 Demo 的搜索框输入 `,(0,n.jsx)(r.code,{children:`React`}),`、`,(0,n.jsx)(r.code,{children:`工具`}),` 或其他关键词：`]}),(0,n.jsxs)(r.ol,{children:[`
`,(0,n.jsxs)(r.li,{children:[`观察输入框显示新的 `,(0,n.jsx)(r.code,{children:`query`}),`。`]}),`
`,(0,n.jsx)(r.li,{children:`观察 Summary 的匹配数量和过滤条件同步变化。`}),`
`,(0,n.jsxs)(r.li,{children:[`观察 List 使用同一个 `,(0,n.jsx)(r.code,{children:`query`}),` 得到新的过滤结果。`]}),`
`,(0,n.jsx)(r.li,{children:`点击清空按钮，确认三个区域再次同时回到同一个父级状态所决定的结果。`}),`
`]}),(0,n.jsx)(r.p,{children:`这个实验验证的是“一个 owner，多处消费”，不是两个本地 State 互相复制。`})]}),`
`,(0,n.jsx)(s,{action:`在 SearchBox 输入关键词或清空 query`,observe:`同一个父级 query 如何同时决定 SearchBox、SearchSummary 与 FrameworkList；子组件之间没有互相 setState。`}),`
`,(0,n.jsx)(r.h2,{id:`为什么不让每个子组件保存一份-query`,children:`为什么不让每个子组件保存一份 query？`}),`
`,(0,n.jsx)(r.p,{children:`如果 SearchBox、Summary、List 各自保存：`}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-text`,children:`inputQuery
summaryQuery
listQuery
`})}),`
`,(0,n.jsx)(r.p,{children:`就会立刻出现新的正确性问题：`}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-text`,children:`它们什么时候同步？
谁先更新？
某条更新路径漏掉其中一个怎么办？
`})}),`
`,(0,n.jsxs)(r.p,{children:[`这和重复保存 `,(0,n.jsx)(r.code,{children:`fullName`}),`、复制 selected object 是同一种数据建模问题：`,(0,n.jsx)(r.strong,{children:`一个事实被复制成多份可独立变化的 State。`})]}),`
`,(0,n.jsxs)(r.p,{children:[`提升之后，合法状态空间变得更小：三个区域只能基于同一个 `,(0,n.jsx)(r.code,{children:`query`}),` 渲染。`]}),`
`,(0,n.jsx)(r.h2,{id:`callback-表达的是意图不是子组件越权修改父级-state`,children:`callback 表达的是意图，不是子组件越权修改父级 State`}),`
`,(0,n.jsx)(r.p,{children:`典型 API：`}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-jsx`,children:`<SearchBox value={query} onChange={setQuery} />
`})}),`
`,(0,n.jsxs)(r.p,{children:[`从组件边界看，`,(0,n.jsx)(r.code,{children:`onChange(next)`}),` 表达“用户希望 query 变成 next”。真正拥有 `,(0,n.jsx)(r.code,{children:`query`}),` 的父组件仍然决定如何处理这个请求。`]}),`
`,(0,n.jsx)(r.p,{children:`今天父级可以直接：`}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-js`,children:`setQuery(next);
`})}),`
`,(0,n.jsx)(r.p,{children:`以后也可以先做：`}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-text`,children:`校验
规范化
权限检查
URL 同步
日志记录
`})}),`
`,(0,n.jsx)(r.p,{children:`再决定最终值。`}),`
`,(0,n.jsxs)(r.p,{children:[`这也是状态提升和 controlled component 之间的直接联系：`,(0,n.jsx)(r.strong,{children:`值的 authority 在 owner，子组件通过事件回报意图。`})]}),`
`,(0,n.jsxs)(o,{title:`不要把 State 提升得比协同范围更高`,children:[(0,n.jsx)(r.p,{children:`如果一份 State 只有一个局部组件需要，留在本地通常更好。只有当多个组件确实需要基于同一事实协调时，才把 owner 提升到能够覆盖这些消费者的最近共同位置。`}),(0,n.jsx)(r.p,{children:`如果跨越非常深或广的树，仅靠逐层 props 已经影响设计，再评估 Context、状态库或路由/Server State 等更合适的归属；“提升到 App 根节点”不是默认答案。`})]}),`
`,(0,n.jsx)(i,{title:`两个本地 State 互相同步`,children:(0,n.jsx)(r.p,{children:`A 更新后再 set B、B 更新后又想 set A，说明系统很可能保存了两份同义事实。优先重新确定唯一 owner，而不是继续添加同步 Effect 或回调链。`})}),`
`,(0,n.jsx)(r.h2,{id:`项目判断规则`,children:`项目判断规则`}),`
`,(0,n.jsx)(r.p,{children:`遇到“两个组件要联动”时先问：`}),`
`,(0,n.jsxs)(r.ol,{children:[`
`,(0,n.jsx)(r.li,{children:`它们是否真的在表达同一份事实？`}),`
`,(0,n.jsx)(r.li,{children:`如果是，这份事实现在是不是被保存了两份？`}),`
`,(0,n.jsx)(r.li,{children:`哪个最近共同祖先能够成为唯一 owner？`}),`
`,(0,n.jsxs)(r.li,{children:[`子组件需要的是 `,(0,n.jsx)(r.code,{children:`value`}),`，还是只需要派生后的更小数据？`]}),`
`,(0,n.jsx)(r.li,{children:`子组件对修改的需求能否用清晰 callback 表达为 intent？`}),`
`]}),`
`,(0,n.jsx)(r.p,{children:`如果答案成立，状态提升通常比“兄弟之间互相同步”更简单，也更容易调试。`}),`
`,(0,n.jsx)(d,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`状态提升解决的是共享事实的 ownership，不是组件间消息总线问题。`}),`
`,(0,n.jsx)(r.li,{children:`共享事实通常只保留一份，由最近共同 owner 持有。`}),`
`,(0,n.jsx)(r.li,{children:`数据通过 props 向下，用户意图通过 callback 向上。`}),`
`,(0,n.jsx)(r.li,{children:`不需要协同的 State 不要为了统一而过度提升。`}),`
`]})}),`
`,(0,n.jsx)(l,{items:[{label:`React: Sharing State Between Components`,href:`https://react.dev/learn/sharing-state-between-components`},{label:`React: Choosing the State Structure`,href:`https://react.dev/learn/choosing-the-state-structure`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};