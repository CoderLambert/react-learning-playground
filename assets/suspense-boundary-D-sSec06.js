import{d as e,p as t}from"./index-CvFUQ0Qp.js";var n=t();function r(t){let r={h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,Compare:s,DemoReference:c,Experiment:l,FurtherReading:u,MentalModel:d,Observation:f,Summary:p}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`Compare`,!0),c||a(`DemoReference`,!0),l||a(`Experiment`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Observation`,!0),p||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`suspense-boundary设计-reveal-sequence`,children:`Suspense Boundary：设计 Reveal Sequence`}),`
`,(0,n.jsx)(r.p,{children:`Suspense boundary 定义“哪些 UI 在等待时一起显示 fallback，以及准备好后如何 reveal”。嵌套 boundary 可以让外层骨架先出现，再逐步揭示较慢区域。`}),`
`,(0,n.jsx)(d,{title:`Boundary 是产品体验边界，不是每个组件一个 loading`,children:`把应该一起出现的内容放在同一 boundary；把允许独立等待的较慢区域放进更深 boundary。边界结构直接表达 reveal sequence。`}),`
`,(0,n.jsx)(s,{leftTitle:`单一 Boundary`,rightTitle:`嵌套 Boundary`,left:[`任一关键子项 suspend 时整体 fallback`,`实现简单`,`可能隐藏已准备内容`],right:[`外层先 reveal`,`慢区域继续局部 fallback`,`可表达渐进式体验`]}),`
`,(0,n.jsx)(l,{title:`比较快慢资源`,children:(0,n.jsx)(r.p,{children:`使用中间 Demo 切换单一/嵌套 boundary，并观察不同资源延迟组合。记录哪个 fallback 出现、哪些区域能够提前保留或 reveal。`})}),`
`,(0,n.jsx)(c,{action:`切换单一/嵌套 boundary 并调整资源延迟组合`,observe:`记录整体 fallback、局部 fallback 与逐步 reveal 的差异；不要把 Suspense 本身当作数据缓存协议。`}),`
`,(0,n.jsx)(f,{children:`Suspense 的价值不是让请求更快，而是让 React 能协调“等待中的树”与“已提交的 UI”，从而避免手工 loading 状态散落在组件层级中。`}),`
`,(0,n.jsx)(i,{title:`机械地细分 Boundary`,children:`过多细碎 fallback 会产生闪烁和视觉噪声。边界粒度应与设计稿中的 loading/reveal 单元一致。`}),`
`,(0,n.jsx)(o,{children:`Suspense 本身不定义数据缓存协议。框架/数据层需要提供可与 Suspense 协作的资源；不要把任意 Promise 都假定为生产级 Suspense 数据方案。`}),`
`,(0,n.jsx)(p,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`Boundary 定义等待与 reveal 范围`}),`
`,(0,n.jsx)(r.li,{children:`嵌套可实现渐进 reveal`}),`
`,(0,n.jsx)(r.li,{children:`粒度由 UX 决定`}),`
`,(0,n.jsx)(r.li,{children:`Suspense 不等于数据缓存层`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React: Suspense`,href:`https://react.dev/reference/react/Suspense`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};