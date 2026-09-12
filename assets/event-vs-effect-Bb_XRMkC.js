import{d as e,p as t}from"./index-CvFUQ0Qp.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,strong:`strong`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,FurtherReading:l,MentalModel:u,Summary:d}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`FurtherReading`,!0),u||a(`MentalModel`,!0),d||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`event-vs-effect按为什么执行划分职责`,children:`Event vs Effect：按“为什么执行”划分职责`}),`
`,(0,n.jsxs)(r.p,{children:[`Event Handler 和 Effect 都能执行副作用，区别不在“有没有副作用”，而在`,(0,n.jsx)(r.strong,{children:`这段逻辑为什么必须执行`}),`。`]}),`
`,(0,n.jsx)(u,{title:`Event 是一次因果；Effect 是持续同步`,children:(0,n.jsx)(r.p,{children:`“用户刚点击购买，所以发起一次购买命令”属于 Event。 “只要 online 是 true，外部连接就必须保持在线”属于 Effect。前者由具体交互触发，后者由当前渲染状态决定同步关系。`})}),`
`,(0,n.jsx)(r.h2,{id:`先做-ab-实验`,children:`先做 A/B 实验`}),`
`,(0,n.jsx)(c,{title:`把一次命令错误地改成 State + Effect`,children:(0,n.jsxs)(r.p,{children:[`先用左侧“直接购买”触发一次命令。再用右侧 `,(0,n.jsx)(r.code,{children:`setRequested(true)`}),` 让 Effect 发起同样的命令；在请求尚未完成时切换商品。观察右侧命令启动次数为什么会增加，而左侧不会因为商品选择变化自动重放已经发生的点击。`]})}),`
`,(0,n.jsx)(s,{action:`分别触发 Event 路径和 State + Effect 路径，并在 Effect 请求中途切换 product`,observe:`比较两边实际命令启动次数，以及依赖变化为何会让 Effect 重新同步。`}),`
`,(0,n.jsxs)(r.p,{children:[`React 的 Effect 是 reactive 的：它读取的 reactive values 发生变化时，需要重新同步。这个性质非常适合连接、订阅、浏览器 API、第三方实例等外部系统；但如果一条业务命令只应该由某次明确交互触发，把它改造成 `,(0,n.jsx)(r.code,{children:`flag → Effect → command`}),`，就把一次性因果错误地建模成了持续同步关系。`]}),`
`,(0,n.jsx)(i,{title:`State 充当事件总线`,children:(0,n.jsxs)(r.p,{children:[`为了让 Effect 知道“按钮刚被点击”，额外创建 `,(0,n.jsx)(r.code,{children:`requested`}),`、`,(0,n.jsx)(r.code,{children:`submitted`}),`、`,(0,n.jsx)(r.code,{children:`shouldNotify`}),` 等瞬时 State，通常会扩大状态空间，并让依赖变化、恢复状态或重新同步参与到本来只属于一次交互的业务命令里。`]})}),`
`,(0,n.jsx)(r.h2,{id:`effect-什么时候反而是正确答案`,children:`Effect 什么时候反而是正确答案`}),`
`,(0,n.jsx)(r.p,{children:`Demo 下方的 online 示例展示了另一类需求：只要当前 React 状态是 online，外部系统就应该保持 online；状态变为 offline，就应该重新同步。这里 Effect 的重复 setup / cleanup 不是风险，而正是需求本身。`}),`
`,(0,n.jsx)(o,{children:(0,n.jsx)(r.p,{children:`事件可以更新 State，而新的 State 又要求外部系统同步。这种情况下 handler 负责“发生了什么”，Effect 负责“当前状态要求外部系统保持什么”，两者可以同时存在，并不冲突。`})}),`
`,(0,n.jsx)(r.h2,{id:`项目决策规则`,children:`项目决策规则`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`逻辑只因为这次点击、提交、删除、下载等动作发生 → 放 Event Handler。`}),`
`,(0,n.jsx)(r.li,{children:`逻辑要求某个外部系统始终与当前 props/state 保持一致 → 用 Effect。`}),`
`,(0,n.jsx)(r.li,{children:`如果发现自己创建一个 boolean flag 只是为了让 Effect 执行一次命令 → 先重新检查因果模型。`}),`
`]}),`
`,(0,n.jsx)(d,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`Event 回答“刚发生了什么”。`}),`
`,(0,n.jsx)(r.li,{children:`Effect 回答“当前状态要求外部系统同步成什么”。`}),`
`,(0,n.jsx)(r.li,{children:`不要用 State + Effect 模拟一次性用户命令。`}),`
`,(0,n.jsx)(r.li,{children:`Event 改 State、Effect 再同步外部系统，是合法且常见的组合。`}),`
`]})}),`
`,(0,n.jsx)(l,{items:[{label:`React: Separating Events from Effects`,href:`https://react.dev/learn/separating-events-from-effects`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};