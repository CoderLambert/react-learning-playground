import{v as e,w as t}from"./index-BQUrGTij.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,FurtherReading:l,MentalModel:u,Summary:d}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`FurtherReading`,!0),u||a(`MentalModel`,!0),d||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`state-snapshotbatching-与-update-queue`,children:`State Snapshot、Batching 与 Update Queue`}),`
`,(0,n.jsx)(u,{title:`当前 render 是固定快照，setter 请求下一次 render`,children:(0,n.jsx)(r.p,{children:`组件每次 render 都拿到一份固定的 state。调用 setter 不会改写当前 handler 已经闭包捕获的值；它会把更新请求加入队列，React 随后处理这些请求并为下一次 render 计算 state。`})}),`
`,(0,n.jsxs)(r.p,{children:[`与其背“setState 是异步的”，更可靠的是区分三个东西：`,(0,n.jsx)(r.strong,{children:`current snapshot、pending update queue、next render state`}),`。`]}),`
`,(0,n.jsx)(r.h2,{id:`用-queue-debugger-观察四种情况`,children:`用 Queue Debugger 观察四种情况`}),`
`,(0,n.jsx)(c,{title:`先预测队列结果`,children:(0,n.jsxs)(r.p,{children:[`把 count Reset 到 0，然后依次运行 `,(0,n.jsx)(r.code,{children:`Replace × 3`}),`、`,(0,n.jsx)(r.code,{children:`Updater × 3`}),`、`,(0,n.jsx)(r.code,{children:`Replace + Updater`}),`、`,(0,n.jsx)(r.code,{children:`Replace + Updater + Replace 42`}),`。每次点击前先预测 next render state，再对照 Demo 展开的队列步骤。`]})}),`
`,(0,n.jsx)(s,{action:`依次运行四个 queue scenario`,observe:`比较同一 snapshot 上的 replace update、连续 updater、以及 replace/updater 混合时的处理顺序和最终 state。`}),`
`,(0,n.jsx)(r.h3,{id:`1-replace--3`,children:`1. Replace × 3`}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-jsx`,children:`setCount(count + 1)
setCount(count + 1)
setCount(count + 1)
`})}),`
`,(0,n.jsxs)(r.p,{children:[`如果当前 snapshot 是 `,(0,n.jsx)(r.code,{children:`0`}),`，三行计算出的都是 `,(0,n.jsx)(r.code,{children:`1`}),`。队列里等价于连续三次“replace with 1”，最终仍是 `,(0,n.jsx)(r.code,{children:`1`}),`。`]}),`
`,(0,n.jsx)(r.h3,{id:`2-updater--3`,children:`2. Updater × 3`}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-jsx`,children:`setCount(n => n + 1)
setCount(n => n + 1)
setCount(n => n + 1)
`})}),`
`,(0,n.jsxs)(r.p,{children:[`React 处理队列时，会把前一个 updater 的结果交给后一个。以 `,(0,n.jsx)(r.code,{children:`0`}),` 开始就是 `,(0,n.jsx)(r.code,{children:`0 → 1 → 2 → 3`}),`。`]}),`
`,(0,n.jsx)(r.h3,{id:`3-replace--updater`,children:`3. Replace + Updater`}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-jsx`,children:`setCount(count + 5)
setCount(n => n + 1)
`})}),`
`,(0,n.jsxs)(r.p,{children:[`若 snapshot 是 `,(0,n.jsx)(r.code,{children:`0`}),`，先 replace 为 `,(0,n.jsx)(r.code,{children:`5`}),`，再把 `,(0,n.jsx)(r.code,{children:`5`}),` 交给 updater，结果是 `,(0,n.jsx)(r.code,{children:`6`}),`。这说明 updater 读取的是队列中的 pending state，而不是永远读取事件开始时的 snapshot。`]}),`
`,(0,n.jsx)(r.h3,{id:`4-replace--updater--replace`,children:`4. Replace + Updater + Replace`}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-jsx`,children:`setCount(count + 5)
setCount(n => n + 1)
setCount(42)
`})}),`
`,(0,n.jsxs)(r.p,{children:[`队列先得到 `,(0,n.jsx)(r.code,{children:`5`}),`，再得到 `,(0,n.jsx)(r.code,{children:`6`}),`，最后的 replace 把结果替换为 `,(0,n.jsx)(r.code,{children:`42`}),`。这也是 React 官方用来解释“值更新”和“updater function”语义差异的典型案例。`]}),`
`,(0,n.jsx)(r.h2,{id:`batching-到底意味着什么`,children:`Batching 到底意味着什么`}),`
`,(0,n.jsx)(r.p,{children:`React 会等待当前事件处理代码完成后再处理这些 state 更新，这就是这里要理解的 batching。它减少不必要的中间 render，也避免界面只更新了一半的状态。`}),`
`,(0,n.jsxs)(r.p,{children:[`但 batching `,(0,n.jsx)(r.strong,{children:`不是`}),`把普通 JavaScript 语句变成异步，也不是说所有时间、所有事件都会被合成一次。React 官方明确说明，不同的 intentional event（例如两次独立点击）会分别处理；因此应理解更新边界，而不是背“所有 setState 都一起执行”。`]}),`
`,(0,n.jsx)(i,{title:`调用 setter 后立即读取当前变量并期待它已经变化`,children:(0,n.jsxs)(r.p,{children:[`当前 handler 中的 `,(0,n.jsx)(r.code,{children:`count`}),` 属于创建这个 handler 的那次 render。setter 不会原地改写它。需要基于前一个 pending state 连续计算时使用 functional updater；需要在新 state 生效后与外部系统同步时，让后续 render / Effect 承担职责。`]})}),`
`,(0,n.jsx)(r.h2,{id:`项目决策规则`,children:`项目决策规则`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[`next state 完全由当前事件参数或常量决定 → 直接 `,(0,n.jsx)(r.code,{children:`setState(nextValue)`}),` 很清楚。`]}),`
`,(0,n.jsx)(r.li,{children:`next state 依赖同一个 state 的前一个 pending value → 用 functional updater。`}),`
`,(0,n.jsx)(r.li,{children:`连续混用 replace 与 updater → 按队列顺序逐项推演，不要靠直觉。`}),`
`,(0,n.jsx)(r.li,{children:`多个 state 总是一起变化且规则复杂 → 考虑 reducer 或重新设计 state model。`}),`
`]}),`
`,(0,n.jsx)(o,{children:(0,n.jsx)(r.p,{children:`Updater function 必须保持纯函数。开发环境 Strict Mode 可能额外调用 updater 来帮助发现不纯逻辑，因此不要在 updater 中执行日志上报、网络请求等副作用。`})}),`
`,(0,n.jsx)(d,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`当前 render 的 state 是固定 snapshot。`}),`
`,(0,n.jsx)(r.li,{children:`setter 请求新的 render，不会修改当前 snapshot。`}),`
`,(0,n.jsx)(r.li,{children:`普通值更新表示 replace；updater function 表示基于 pending state 的变换。`}),`
`,(0,n.jsx)(r.li,{children:`React 按队列顺序计算 next state，混合 update 也遵守同一规则。`}),`
`]})}),`
`,(0,n.jsx)(l,{items:[{label:`React: State as a Snapshot`,href:`https://react.dev/learn/state-as-a-snapshot`},{label:`React: Queueing a Series of State Updates`,href:`https://react.dev/learn/queueing-a-series-of-state-updates`},{label:`React: Render and Commit`,href:`https://react.dev/learn/render-and-commit`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};