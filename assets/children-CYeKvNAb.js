import{d as e,p as t}from"./index-D7arEcQ9.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,h3:`h3`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,Compare:s,DemoReference:c,Experiment:l,Flow:u,FurtherReading:d,MentalModel:f,Summary:p}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`Compare`,!0),c||a(`DemoReference`,!0),l||a(`Experiment`,!0),u||a(`Flow`,!0),d||a(`FurtherReading`,!0),f||a(`MentalModel`,!0),p||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`children-默认插槽与组合`,children:`Children 默认插槽与组合`}),`
`,(0,n.jsx)(f,{title:`children 让容器拥有结构，让调用者拥有内容`,children:(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`children`}),` 是普通 prop，但它承载调用位置嵌套的 React 节点。容器组件可以负责边框、布局、交互骨架，而不必知道内部具体内容，从而形成稳定的 composition seam。`]})}),`
`,(0,n.jsx)(l,{title:`替换内容而不改容器`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 中比较 CardContainer 与 ModalLayout：保持容器实现不变，替换嵌套内容，观察结构职责与内容职责如何分离。`})}),`
`,(0,n.jsx)(c,{action:`切换不同 children 内容和容器示例`,observe:`确认容器不需要读取业务字段，也能复用同一布局协议。`}),`
`,(0,n.jsx)(u,{items:[`调用者声明嵌套节点`,`React 将节点作为 children prop`,`容器决定 children 放置位置`,`调用者继续拥有内容语义`]}),`
`,(0,n.jsxs)(s,{children:[(0,n.jsx)(r.h3,{id:`composition`,children:`Composition`}),(0,n.jsx)(r.p,{children:`调用者直接传 React 节点，API 接近最终 UI 结构，适合布局和包装器。`}),(0,n.jsx)(r.h3,{id:`大配置对象`,children:`大配置对象`}),(0,n.jsx)(r.p,{children:`容器读取大量业务字段再决定如何渲染，短期集中、长期容易形成条件分支和隐式协议。`})]}),`
`,(0,n.jsx)(o,{title:`children 不等于共享 state`,children:(0,n.jsx)(r.p,{children:`Composition 解决的是结构与依赖传递问题。多个子节点若需要共享可变数据，仍应明确 state ownership，再通过 props、Context 或其他合适机制传播。`})}),`
`,(0,n.jsx)(i,{title:`为了复用把所有差异都变成 boolean props`,children:(0,n.jsxs)(r.p,{children:[`当组件出现 `,(0,n.jsx)(r.code,{children:`showHeader`}),`、`,(0,n.jsx)(r.code,{children:`compactFooter`}),`、`,(0,n.jsx)(r.code,{children:`customBodyType`}),` 等大量开关时，优先检查是否应该让调用者直接组合节点，而不是继续扩张配置矩阵。`]})}),`
`,(0,n.jsx)(p,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.code,{children:`children`}),` 是 React 的默认内容插槽。`]}),`
`,(0,n.jsx)(r.li,{children:`Composition 将结构骨架与业务内容解耦。`}),`
`,(0,n.jsx)(r.li,{children:`组合优先于不断膨胀的配置开关。`}),`
`,(0,n.jsx)(r.li,{children:`数据所有权与 UI 组合是两个不同问题。`}),`
`]})}),`
`,(0,n.jsx)(d,{items:[{label:`React: Passing Props — children`,href:`https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children`},{label:`React: Thinking in React`,href:`https://react.dev/learn/thinking-in-react`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};