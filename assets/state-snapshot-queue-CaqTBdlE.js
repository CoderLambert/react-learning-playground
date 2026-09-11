import{d as e,p as t}from"./index-B4AkXXb7.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,Compare:s,DemoReference:c,Experiment:l,Flow:u,FurtherReading:d,MentalModel:f,Observation:p,Summary:m,Timeline:h}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`Compare`,!0),c||a(`DemoReference`,!0),l||a(`Experiment`,!0),u||a(`Flow`,!0),d||a(`FurtherReading`,!0),f||a(`MentalModel`,!0),p||a(`Observation`,!0),m||a(`Summary`,!0),h||a(`Timeline`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`state-snapshotbatching-与-update-queue`,children:`State Snapshot、Batching 与 Update Queue`}),`
`,(0,n.jsx)(f,{title:`一次 render 看到的是一张固定快照`,children:(0,n.jsxs)(r.p,{children:[`组件函数每次执行都会得到当次 render 对应的 state 快照。事件处理函数闭包读取的也是这张快照；调用 `,(0,n.jsx)(r.code,{children:`setState`}),` 并不会改写当前这次函数执行中的变量，而是把下一次 render 所需的更新加入队列。`]})}),`
`,(0,n.jsx)(r.h2,{id:`先预测再点击-demo`,children:`先预测，再点击 Demo`}),`
`,(0,n.jsx)(l,{title:`连续更新实验`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 中先观察当前计数值，然后分别执行“连续三次直接更新”和“连续三次 functional updater”。点击前先写下你预测的最终值与日志顺序。`})}),`
`,(0,n.jsx)(c,{action:`分别触发直接更新与 functional updater 的按钮`,observe:`比较 handler 内读取到的 state、最终 UI 值，以及 updater 的执行顺序。`}),`
`,(0,n.jsx)(p,{children:(0,n.jsxs)(r.p,{children:[`同一个事件处理阶段里的多次更新通常会被 batching。`,(0,n.jsx)(r.code,{children:`setCount(count + 1)`}),` 三次都基于同一张 `,(0,n.jsx)(r.code,{children:`count`}),` 快照计算；`,(0,n.jsx)(r.code,{children:`setCount(c => c + 1)`}),` 则把三个变换依次放进 update queue，让后一个 updater 接收前一个 updater 的结果。`]})}),`
`,(0,n.jsx)(r.h2,{id:`更新是怎样流动的`,children:`更新是怎样流动的`}),`
`,(0,n.jsx)(h,{steps:[`事件处理函数开始，读取当前 render 的 state snapshot`,`setState 调用把 replace update 或 updater function 加入队列`,`React 在合适的边界结束 batching，调度下一次 render`,`render 阶段按顺序处理 update queue，计算下一份 state`,`commit 阶段把必要的 DOM 变化应用到页面`]}),`
`,(0,n.jsxs)(s,{children:[(0,n.jsx)(r.h3,{id:`直接值更新`,children:`直接值更新`}),(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-jsx`,children:`setCount(count + 1)
setCount(count + 1)
setCount(count + 1)
`})}),(0,n.jsxs)(r.p,{children:[`三行都读取当前 handler 闭包里的同一个 `,(0,n.jsx)(r.code,{children:`count`}),`。`]}),(0,n.jsx)(r.h3,{id:`functional-updater`,children:`Functional updater`}),(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-jsx`,children:`setCount(c => c + 1)
setCount(c => c + 1)
setCount(c => c + 1)
`})}),(0,n.jsx)(r.p,{children:`每个 updater 接收队列中前一步计算出的 pending state。`})]}),`
`,(0,n.jsx)(i,{title:`把 setState 当作同步赋值`,children:(0,n.jsxs)(r.p,{children:[`不要在调用 `,(0,n.jsx)(r.code,{children:`setState`}),` 后立即假设同一个事件处理函数中的 state 变量已经变化。需要基于前一个 state 连续计算时，使用 functional updater；需要响应新的 state 做外部同步时，应让后续 render / Effect 承担职责，而不是读取“刚 set 完”的旧快照。`]})}),`
`,(0,n.jsx)(o,{title:`Batching 不等于所有代码都延迟执行`,children:(0,n.jsxs)(r.p,{children:[`事件处理函数本身仍按 JavaScript 同步执行。React batching 的重点是合并状态更新与 render 调度，而不是把普通 JavaScript 语句改造成异步。遇到 `,(0,n.jsx)(r.code,{children:`await`}),`、定时器、原生事件或不同 React 版本时，应基于实际边界理解批处理，而不是背诵“所有 setState 都会一起合并”。`]})}),`
`,(0,n.jsx)(r.h2,{id:`用一句话判断该写哪种更新`,children:`用一句话判断该写哪种更新`}),`
`,(0,n.jsx)(u,{items:[`新值完全由当前事件参数决定 → 可以直接 setState(nextValue)`,`新值依赖同一个 state 的前一个 pending 值 → functional updater`,`多个 state 总是一起变化且规则复杂 → 考虑 reducer / 更好的 state model`]}),`
`,(0,n.jsx)(m,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`render 中的 state 是快照，不是可变盒子。`}),`
`,(0,n.jsx)(r.li,{children:`batching 让 React 在一个更新边界内集中处理多次 state 请求。`}),`
`,(0,n.jsx)(r.li,{children:`functional updater 表达的是“基于队列前值的变换”，不是语法偏好。`}),`
`,(0,n.jsx)(r.li,{children:`Trigger → Render → Commit 是理解 state 更新时序的主轴。`}),`
`]})}),`
`,(0,n.jsx)(d,{items:[{label:`React: State as a Snapshot`,href:`https://react.dev/learn/state-as-a-snapshot`},{label:`React: Queueing a Series of State Updates`,href:`https://react.dev/learn/queueing-a-series-of-state-updates`},{label:`React: Render and Commit`,href:`https://react.dev/learn/render-and-commit`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};