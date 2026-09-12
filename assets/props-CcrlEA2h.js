import{d as e,p as t}from"./index-D1uhzPvO.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,h3:`h3`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,Compare:s,DemoReference:c,Experiment:l,Flow:u,FurtherReading:d,MentalModel:f,Summary:p}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`Compare`,!0),c||a(`DemoReference`,!0),l||a(`Experiment`,!0),u||a(`Flow`,!0),d||a(`FurtherReading`,!0),f||a(`MentalModel`,!0),p||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`props-基础与解构`,children:`Props 基础与解构`}),`
`,(0,n.jsx)(f,{title:`Props 是父组件给子组件的一次 render 输入`,children:(0,n.jsx)(r.p,{children:`Props 表达父 → 子的数据流。子组件可以读取、解构和基于 props 派生值，但不应修改 props 本身；需要改变数据时，应通过事件回调把“发生了什么”通知拥有该数据的组件。`})}),`
`,(0,n.jsx)(l,{title:`观察只读输入与派生计算`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 中修改父级提供的数据，比较 UserCard、ProductCard 的输出，并观察默认值、对象展开与派生展示如何随下一次 render 更新。`})}),`
`,(0,n.jsx)(c,{action:`改变父级输入并比较多个子组件`,observe:`确认数据从父到子流动；子组件只消费输入，派生值无需额外 state。`}),`
`,(0,n.jsx)(u,{items:[`父组件拥有数据`,`render 时通过 JSX attributes 传入 props`,`子组件读取/解构`,`子组件计算 UI`,`需要修改时通过 callback prop 上报事件`]}),`
`,(0,n.jsxs)(s,{children:[(0,n.jsx)(r.h3,{id:`props`,children:`Props`}),(0,n.jsx)(r.p,{children:`由父组件提供，是当前 render 的只读输入。`}),(0,n.jsx)(r.h3,{id:`state`,children:`State`}),(0,n.jsx)(r.p,{children:`由组件树中的某个位置拥有，可通过更新请求驱动下一次 render。`})]}),`
`,(0,n.jsx)(o,{title:`默认值只处理 undefined`,children:(0,n.jsxs)(r.p,{children:[`解构默认值在属性缺失或值为 `,(0,n.jsx)(r.code,{children:`undefined`}),` 时生效；显式传入 `,(0,n.jsx)(r.code,{children:`null`}),` 不会触发默认值。展开 props 很方便，但公共组件中过度透传会模糊 API 边界。`]})}),`
`,(0,n.jsx)(i,{title:`复制 props 到 state 后持续同步`,children:(0,n.jsx)(r.p,{children:`若一个值能直接从 props 计算，就不要再保存一份 state 并用 Effect 同步。重复数据源会制造过期和冲突；只有确实需要“以 props 初始化后独立演化”的状态才应单独建模。`})}),`
`,(0,n.jsx)(p,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`Props 是父 → 子的只读 render 输入。`}),`
`,(0,n.jsx)(r.li,{children:`callback prop 用来把事件向拥有数据的一侧传递。`}),`
`,(0,n.jsx)(r.li,{children:`能从 props 派生的值通常直接计算。`}),`
`,(0,n.jsx)(r.li,{children:`明确的 props API 比无边界对象展开更可维护。`}),`
`]})}),`
`,(0,n.jsx)(d,{items:[{label:`React: Passing Props to a Component`,href:`https://react.dev/learn/passing-props-to-a-component`},{label:`React: Sharing State Between Components`,href:`https://react.dev/learn/sharing-state-between-components`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};