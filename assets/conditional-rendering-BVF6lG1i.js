import{d as e,p as t}from"./index-BR2czpYZ.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,Flow:l,FurtherReading:u,MentalModel:d,Summary:f}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`Flow`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`条件渲染与业务四态`,children:`条件渲染与业务四态`}),`
`,(0,n.jsx)(d,{title:`条件渲染就是把当前状态映射为 UI`,children:(0,n.jsxs)(r.p,{children:[`React 不提供特殊模板指令；使用 JavaScript 的 `,(0,n.jsx)(r.code,{children:`if`}),`、early return、三元表达式和 `,(0,n.jsx)(r.code,{children:`&&`}),` 即可描述分支。工程重点是先把业务状态建模清楚，再让每个状态映射到唯一、可理解的界面。`]})}),`
`,(0,n.jsx)(c,{title:`遍历 loading / error / empty / success`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 中依次切换四种状态。先判断每种状态应显示什么，再观察不同条件写法是否保持相同业务语义。`})}),`
`,(0,n.jsx)(s,{action:`依次切换四态`,observe:`检查任一时刻是否只有符合当前状态的 UI 分支出现，并关注分支优先级。`}),`
`,(0,n.jsx)(l,{items:[`识别业务状态`,`确定互斥/可并存关系`,`优先处理阻断态`,`渲染主成功态`,`让分支结构反映业务优先级`]}),`
`,(0,n.jsx)(o,{title:`&& 的左值会影响输出`,children:(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`condition && <View />`}),` 适合明确 boolean 条件。像 `,(0,n.jsx)(r.code,{children:`count && <View />`}),` 这样的写法在 `,(0,n.jsx)(r.code,{children:`count`}),` 为 `,(0,n.jsx)(r.code,{children:`0`}),` 时可能把 `,(0,n.jsx)(r.code,{children:`0`}),` 渲染出来；需要布尔语义时显式比较或转换。`]})}),`
`,(0,n.jsx)(i,{title:`用多个松散 boolean 表达一个互斥状态机`,children:(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`isLoading`}),`、`,(0,n.jsx)(r.code,{children:`hasError`}),`、`,(0,n.jsx)(r.code,{children:`isEmpty`}),` 若能同时为 true，就可能出现不可能状态。复杂场景优先用单一 status/discriminated union 表达状态，再进行 UI 映射。`]})}),`
`,(0,n.jsx)(f,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`条件渲染使用普通 JavaScript 控制流。`}),`
`,(0,n.jsx)(r.li,{children:`先建模状态，再选择语法。`}),`
`,(0,n.jsx)(r.li,{children:`early return 很适合阻断态。`}),`
`,(0,n.jsx)(r.li,{children:`避免能组合出矛盾 UI 的松散 boolean。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React: Conditional Rendering`,href:`https://react.dev/learn/conditional-rendering`},{label:`React: Choosing the State Structure`,href:`https://react.dev/learn/choosing-the-state-structure`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};