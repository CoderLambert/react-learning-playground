import{d as e,p as t}from"./index-CvFUQ0Qp.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,Flow:l,FurtherReading:u,MentalModel:d,Observation:f,Summary:p}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`Flow`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Observation`,!0),p||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`componentjsx-与纯渲染`,children:`Component、JSX 与纯渲染`}),`
`,(0,n.jsx)(d,{title:`组件是从输入到 UI 描述的纯计算`,children:(0,n.jsx)(r.p,{children:`函数组件不是“生成 DOM 的模板函数”，而是在一次 render 中读取 props、state、context，并返回 React 元素树。JSX 只是表达这棵 UI 树的语法；相同输入应得到相同描述，render 阶段不应修改外部世界。`})}),`
`,(0,n.jsx)(c,{title:`把 JSX 当作计算结果观察`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 中切换输入并观察组件树；再关注 Fragment、表达式插值和纯/非纯计算示例。先预测哪些变化需要重新计算 UI，哪些行为不应发生在 render 中。`})}),`
`,(0,n.jsx)(s,{action:`切换 Demo 中可交互输入并观察输出`,observe:`区分组件函数执行、返回 JSX 与最终 DOM 更新；确认 JSX 表达式来自当前 render 的输入。`}),`
`,(0,n.jsx)(l,{items:[`React 触发 render`,`调用组件函数读取当前输入`,`JSX 形成 React 元素描述`,`React 比较结果`,`commit 必要的 DOM 变化`]}),`
`,(0,n.jsx)(f,{children:(0,n.jsx)(r.p,{children:`组件函数可以多次执行，执行次数不等于 DOM 更新次数。纯 render 让 React 能安全地重试、暂停或重复计算；副作用若藏在 render 中，就会把“可重复计算”变成不可预测的外部修改。`})}),`
`,(0,n.jsx)(o,{title:`JSX 不是 HTML 字符串`,children:(0,n.jsxs)(r.p,{children:[`JSX 会变成 JavaScript 表达式并创建 React 元素描述。`,(0,n.jsx)(r.code,{children:`className`}),`、事件属性、对象形式的 `,(0,n.jsx)(r.code,{children:`style`}),` 等遵循 React API，而不是字符串模板规则。Fragment 用于组织兄弟节点而不额外制造 DOM 容器。`]})}),`
`,(0,n.jsx)(i,{title:`在 render 中产生副作用`,children:(0,n.jsx)(r.p,{children:`不要在组件函数主体里发送请求、写 localStorage、启动定时器或修改外部对象。事件导致的动作放进 Event Handler；因渲染结果需要与外部系统同步的逻辑才考虑 Effect。`})}),`
`,(0,n.jsx)(p,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`Component 是 UI 的可组合计算单元。`}),`
`,(0,n.jsx)(r.li,{children:`JSX 是 UI 描述语法，不是 HTML 字符串。`}),`
`,(0,n.jsx)(r.li,{children:`render 必须保持纯净，DOM 修改属于 commit。`}),`
`,(0,n.jsx)(r.li,{children:`拆组件应围绕职责与可组合 API，而不是机械追求文件数量。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React: Your First Component`,href:`https://react.dev/learn/your-first-component`},{label:`React: Writing Markup with JSX`,href:`https://react.dev/learn/writing-markup-with-jsx`},{label:`React: Keeping Components Pure`,href:`https://react.dev/learn/keeping-components-pure`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};