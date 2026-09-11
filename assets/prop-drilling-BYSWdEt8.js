import{d as e,p as t}from"./index-B4AkXXb7.js";var n=t();function r(t){let r={h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,Flow:l,FurtherReading:u,MentalModel:d,Summary:f}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`Flow`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`属性逐层透传propscomposition-与-context`,children:`属性逐层透传：Props、Composition 与 Context`}),`
`,(0,n.jsx)(d,{title:`先问数据真正需要经过谁，而不是先消灭 drilling`,children:(0,n.jsx)(r.p,{children:`Prop drilling 本身不是错误；显式 props 往往最容易追踪。问题出现在中间层只为转交数据而被迫知道无关细节。此时应先尝试调整组件边界和 composition，再判断 Context 是否真的表达了跨层共享依赖。`})}),`
`,(0,n.jsx)(c,{title:`比较三条传递路径`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 中对比逐层 props、children composition 与 Context。关注每种方案里哪些组件必须知道数据，以及修改数据来源时影响范围如何变化。`})}),`
`,(0,n.jsx)(s,{action:`切换 drilling / composition / Context 方案`,observe:`比较依赖显式程度、中间层耦合和最终消费者的 API。`}),`
`,(0,n.jsx)(l,{items:[`少量明确层级 → props`,`中间层只负责布局 → composition`,`大量深层消费者共享同一环境值 → 考虑 Context`,`复杂可变业务状态 → 再评估 reducer/store`]}),`
`,(0,n.jsx)(o,{title:`Context 不是免费的全局变量`,children:(0,n.jsx)(r.p,{children:`消费 Context 的组件订阅对应 Provider value；value 变化会传播到消费者。Context 适合主题、认证信息、页面级共享模型等“环境式”依赖，不应只为了少写两层 props 就默认引入。`})}),`
`,(0,n.jsx)(i,{title:`看到三层 props 就立即 Context`,children:(0,n.jsx)(r.p,{children:`过早 Context 会隐藏数据来源、扩大更新范围并降低组件复用性。先检查组件是否拆错、是否能把 JSX 直接下传、是否只有少数消费者。`})}),`
`,(0,n.jsx)(f,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`Props drilling 可接受，透明性本身有价值。`}),`
`,(0,n.jsx)(r.li,{children:`Composition 能绕过不需要理解数据的中间层。`}),`
`,(0,n.jsx)(r.li,{children:`Context 适合真正的跨层共享依赖。`}),`
`,(0,n.jsx)(r.li,{children:`选择机制时同时考虑依赖可见性和更新传播。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React: Passing Data Deeply with Context`,href:`https://react.dev/learn/passing-data-deeply-with-context`},{label:`React: Passing Props to a Component`,href:`https://react.dev/learn/passing-props-to-a-component`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};