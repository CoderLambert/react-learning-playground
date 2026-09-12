import{d as e,p as t}from"./index-CvFUQ0Qp.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,Flow:l,FurtherReading:u,MentalModel:d,Observation:f,Summary:p}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`Flow`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Observation`,!0),p||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`custom-hooks复用状态逻辑而不是共享-state`,children:`Custom Hooks：复用状态逻辑，而不是共享 State`}),`
`,(0,n.jsxs)(r.p,{children:[`Custom Hook 是以 `,(0,n.jsx)(r.code,{children:`use`}),` 开头、可以调用其他 Hooks 的函数。它抽取的是状态ful logic；每次调用仍拥有独立的 State 和 Effects。`]}),`
`,(0,n.jsxs)(d,{title:`共享配方，不共享实例`,children:[`两个组件调用同一个 `,(0,n.jsx)(r.code,{children:`useOnlineStatus()`}),`，就像各自按同一配方建立订阅；除非 Hook 连接同一个外部 store，否则它们不会自动共享 React State。`]}),`
`,(0,n.jsx)(l,{items:[`组件调用 custom Hook`,`Hook 组合 useState/useEffect 等`,`返回面向领域的值/操作`,`调用方不必知道同步细节`]}),`
`,(0,n.jsx)(c,{title:`观察调用独立性`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 同时挂载多个使用同一 Custom Hook 的消费者，分别触发局部变化。观察 Hook 代码被复用，但每个组件的 State 生命周期仍由自己的 render tree 身份决定。`})}),`
`,(0,n.jsx)(s,{action:`在 Demo 中同时操作多个 Custom Hook 消费者`,observe:`比较多个消费者的局部变化，确认复用的是状态逻辑而不是同一份 React State 实例。`}),`
`,(0,n.jsxs)(f,{children:[`好的 Custom Hook API 通常描述领域意图，例如 `,(0,n.jsx)(r.code,{children:`useChatRoom`}),`，而不是简单包装 `,(0,n.jsx)(r.code,{children:`useEffectOnce`}),` 之类试图绕开 React 数据流的工具。`]}),`
`,(0,n.jsxs)(i,{title:`把任意 helper 都改成 Hook`,children:[`不使用 Hooks 的纯函数不需要 `,(0,n.jsx)(r.code,{children:`use`}),` 前缀。也不要用 Custom Hook 隐藏错误 Effect；抽象不会修复错误心智模型。`]}),`
`,(0,n.jsx)(o,{children:`Custom Hook 可以封装外部系统同步，但其参数仍是 reactive inputs；调用方需要理解哪些参数变化会导致内部重新同步。`}),`
`,(0,n.jsx)(p,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`Custom Hook 复用逻辑。`}),`
`,(0,n.jsx)(r.li,{children:`每次调用 State 独立。`}),`
`,(0,n.jsx)(r.li,{children:`API 应表达领域意图。`}),`
`,(0,n.jsx)(r.li,{children:`先保证底层 Effect 正确再抽象。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React: Reusing Logic with Custom Hooks`,href:`https://react.dev/learn/reusing-logic-with-custom-hooks`},{label:`React: Rules of Hooks`,href:`https://react.dev/reference/rules/rules-of-hooks`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};