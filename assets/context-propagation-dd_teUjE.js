import{d as e,p as t}from"./index-D7arEcQ9.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,Flow:l,FurtherReading:u,MentalModel:d,Summary:f}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`Flow`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`context-更新传播模型`,children:`Context 更新传播模型`}),`
`,(0,n.jsx)(d,{title:`useContext 是对最近 Provider value 的订阅读取`,children:(0,n.jsx)(r.p,{children:`Context 让深层组件无需逐层 props 就能读取最近 Provider 的 value。消费者不是“读取一次全局变量”；当对应 Context 的 Provider value 变化时，React 会让消费该 Context 的组件获得新值并重新计算。`})}),`
`,(0,n.jsx)(c,{title:`观察 Provider value 的传播范围`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 中更新 Context value，比较消费者、非消费者以及 memo 包裹组件的 render 日志，确认 memo 与 Context 的边界。`})}),`
`,(0,n.jsx)(s,{action:`更新 Provider 中不同字段并观察 render 日志`,observe:`识别哪些组件真正调用 useContext；确认 Context 更新能穿过 memo 到达消费者。`}),`
`,(0,n.jsx)(l,{items:[`Provider 提供 value`,`深层组件 useContext 读取最近 Provider`,`Provider value 变化`,`React 通知对应消费者`,`消费者用新 Context 重新 render`]}),`
`,(0,n.jsx)(o,{title:`memo 不能屏蔽组件自己消费的 Context 更新`,children:(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`memo`}),` 主要比较 props。若组件内部读取的 Context 改变，它仍需要重新 render 才能看到新值。优化 Context 应从 value 建模、Provider 边界和拆分 Context 入手，而不是只包 memo。`]})}),`
`,(0,n.jsx)(i,{title:`一个巨大 Context 承载所有高频状态`,children:(0,n.jsx)(r.p,{children:`把互不相关且更新频率不同的数据塞进同一个 value，会扩大订阅耦合。先按领域和读写模式拆分；必要时再评估外部 store 的 selector 机制。`})}),`
`,(0,n.jsx)(f,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`Context 解决跨层依赖传递，不等于全局状态库。`}),`
`,(0,n.jsx)(r.li,{children:`消费者订阅最近 Provider 的 value。`}),`
`,(0,n.jsx)(r.li,{children:`Context 更新可以让 memoized consumer 重新 render。`}),`
`,(0,n.jsx)(r.li,{children:`Provider/value 的边界设计决定传播成本和可维护性。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React: Passing Data Deeply with Context`,href:`https://react.dev/learn/passing-data-deeply-with-context`},{label:`React: useContext`,href:`https://react.dev/reference/react/useContext`},{label:`React: memo`,href:`https://react.dev/reference/react/memo`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};