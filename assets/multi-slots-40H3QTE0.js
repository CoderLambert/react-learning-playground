import{d as e,p as t}from"./index-DSdxAjqj.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,Flow:l,FurtherReading:u,MentalModel:d,Summary:f}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`Flow`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`具名多插槽与组件-api`,children:`具名多插槽与组件 API`}),`
`,(0,n.jsx)(d,{title:`具名 slot 是显式的结构扩展点`,children:(0,n.jsxs)(r.p,{children:[`React 没有专门的 slot 语法；`,(0,n.jsx)(r.code,{children:`header`}),`、`,(0,n.jsx)(r.code,{children:`footer`}),`、`,(0,n.jsx)(r.code,{children:`actions`}),` 等接收 React 节点的 props 就能形成具名插槽。关键不是名称，而是把“容器控制什么、调用者可替换什么、如何表达缺省与隐藏”定义成稳定协议。`]})}),`
`,(0,n.jsx)(c,{title:`验证三态协议`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 中分别使用默认内容、局部覆盖和显式隐藏，观察 ProductionModal/Pannel 如何区分“未提供”“提供节点”“明确不渲染”。`})}),`
`,(0,n.jsx)(s,{action:`依次切换默认、覆盖、隐藏插槽`,observe:`关注 undefined/null/具体 ReactNode 对组件 API 语义的影响。`}),`
`,(0,n.jsx)(l,{items:[`容器声明稳定区域`,`为可定制区域定义 ReactNode props`,`约定缺省值`,`约定显式隐藏值`,`调用者只覆盖需要变化的区域`]}),`
`,(0,n.jsx)(o,{title:`三态必须写进 API 契约`,children:(0,n.jsxs)(r.p,{children:[`若 `,(0,n.jsx)(r.code,{children:`undefined`}),` 表示使用默认模板，而 `,(0,n.jsx)(r.code,{children:`null`}),` 表示显式隐藏，就不要用模糊的 truthy 判断把两者合并。类型、文档和实现应保持同一语义。`]})}),`
`,(0,n.jsx)(i,{title:`把插槽变成隐式配置 DSL`,children:(0,n.jsx)(r.p,{children:`若一个 slot prop 开始接受复杂对象并由内部解释几十个字段，组合优势就被重新变成配置驱动。能传节点时优先传节点；只有需要稳定数据协议时才传结构化配置。`})}),`
`,(0,n.jsx)(f,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`具名插槽本质是 ReactNode props。`}),`
`,(0,n.jsx)(r.li,{children:`默认、覆盖、隐藏应有明确三态语义。`}),`
`,(0,n.jsx)(r.li,{children:`容器拥有骨架，调用者拥有扩展内容。`}),`
`,(0,n.jsx)(r.li,{children:`API 的可预测性比“支持所有配置”更重要。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React: Passing Props to a Component`,href:`https://react.dev/learn/passing-props-to-a-component`},{label:`React: Choosing the State Structure`,href:`https://react.dev/learn/choosing-the-state-structure`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};