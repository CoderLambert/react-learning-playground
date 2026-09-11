import{d as e,p as t}from"./index-BR2czpYZ.js";var n=t();function r(t){let r={h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,Flow:l,FurtherReading:u,MentalModel:d,Observation:f,Summary:p}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`Flow`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Observation`,!0),p||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`react-compiler-自动优化模型`,children:`React Compiler 自动优化模型`}),`
`,(0,n.jsx)(d,{title:`Compiler 在构建期理解 React 代码并自动 memoize`,children:(0,n.jsx)(r.p,{children:`React Compiler 分析遵守 Rules of React 的组件与 Hooks，在不改变语义的前提下自动缓存可复用的值、函数和子树。它减少的是机械式手工 memoization，不是把任意不纯代码自动修好。`})}),`
`,(0,n.jsx)(c,{title:`把 Demo 当成编译器心智模拟器`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 对比“每次都重新计算”“手工 memo”与“Compiler 可优化的纯表达式”场景，先判断哪些工作理论上可安全复用，再查看展示结果。`})}),`
`,(0,n.jsx)(s,{action:`切换不同优化模型并触发更新`,observe:`重点理解编译器需要纯 render、稳定规则和可分析的数据流，而非只看 render 次数。`}),`
`,(0,n.jsx)(l,{items:[`源码遵守 Rules of React`,`构建阶段 Compiler 静态分析`,`安全区域生成 memoization`,`运行时按依赖/identity 复用结果`,`Profiler 验证实际用户场景收益`]}),`
`,(0,n.jsx)(o,{title:`Compiler 有明确边界`,children:(0,n.jsx)(r.p,{children:`编译器不能替你设计正确的 state ownership，也不能让 render 中的副作用变安全。违反 Rules of React、动态/不受支持模式、部分第三方库边界可能导致代码无法被优化；渐进采用时同一应用可以同时存在已编译与未编译代码。`})}),`
`,(0,n.jsx)(i,{title:`启用 Compiler 后删除所有 memoization`,children:(0,n.jsx)(r.p,{children:`迁移应以官方兼容策略和测量为依据。已有手工 memo 可能承载第三方 identity contract 或位于未编译边界；不要机械删除。反过来，新代码也不应为了旧习惯无条件添加 memo。`})}),`
`,(0,n.jsx)(f,{children:(0,n.jsx)(r.p,{children:`Compiler 的核心前提仍是 React 的纯度与 Hook 规则。eslint-plugin-react-hooks/Compiler diagnostics 应作为迁移反馈，而不是被随意关闭。`})}),`
`,(0,n.jsx)(p,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`Compiler 是构建期自动 memoization，不是运行时魔法。`}),`
`,(0,n.jsx)(r.li,{children:`Rules of React 是可安全优化的基础。`}),`
`,(0,n.jsx)(r.li,{children:`支持渐进采用，未编译边界仍存在。`}),`
`,(0,n.jsx)(r.li,{children:`手工 memo 的保留/删除都应有 contract 或性能证据。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React Compiler`,href:`https://react.dev/learn/react-compiler`},{label:`React Compiler: Introduction`,href:`https://react.dev/reference/react-compiler`},{label:`Rules of React`,href:`https://react.dev/reference/rules`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};