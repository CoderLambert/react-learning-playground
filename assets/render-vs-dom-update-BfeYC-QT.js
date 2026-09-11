import{n as e,r as t}from"./index-B8CSWDOf.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,FurtherReading:l,MentalModel:u,Observation:d,Summary:f,Timeline:p}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`FurtherReading`,!0),u||a(`MentalModel`,!0),d||a(`Observation`,!0),f||a(`Summary`,!0),p||a(`Timeline`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`re-render--dom-update`,children:`Re-render ≠ DOM Update`}),`
`,(0,n.jsx)(u,{title:`Render 是计算，Commit 才是写 DOM`,children:(0,n.jsx)(r.p,{children:`组件重新执行只表示 React 重新计算下一棵 UI；只有比较结果确实要求宿主环境变化时，Commit 才会修改 DOM。性能分析必须区分“组件执行次数”和“真实 DOM mutation 成本”。`})}),`
`,(0,n.jsx)(r.h2,{id:`跟着-demo-验证`,children:`跟着 Demo 验证`}),`
`,(0,n.jsx)(c,{title:`Render 与 MutationObserver 对照`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 触发会导致父组件重新 render、但输出 DOM 保持相同的更新，再触发真正改变文本或节点的更新。比较 render 计数与 MutationObserver 日志。`})}),`
`,(0,n.jsx)(s,{action:`分别触发无 DOM 变化和有 DOM 变化的更新`,observe:`render 次数可能增加，但 DOM mutation 只在 commit 需要时出现。`}),`
`,(0,n.jsx)(p,{steps:[`state/props/context 变化触发更新`,`React 执行组件并计算下一 UI`,`React 比较前后结果`,`Commit 仅应用必要宿主变化`,`浏览器随后布局、绘制与合成`]}),`
`,(0,n.jsx)(d,{children:(0,n.jsx)(r.p,{children:`“re-render”本身不是 bug。真正需要优化的是已测量到的昂贵 render、频繁 commit、布局抖动或长任务，而不是追求 render 次数归零。`})}),`
`,(0,n.jsx)(i,{title:`看到 render 就立即 memo`,children:(0,n.jsxs)(r.p,{children:[`盲目加入 `,(0,n.jsx)(r.code,{children:`memo`}),`、`,(0,n.jsx)(r.code,{children:`useMemo`}),`、`,(0,n.jsx)(r.code,{children:`useCallback`}),` 会增加依赖与认知成本，还可能因为引用不稳定而完全不命中。先用 Profiler 和浏览器性能工具定位瓶颈。`]})}),`
`,(0,n.jsx)(o,{title:`DOM 不变也不代表 render 免费`,children:(0,n.jsx)(r.p,{children:`组件函数、派生计算和子树协调仍可能消耗 CPU；反过来，render 很快时，即使次数较多也未必值得优化。React Compiler 也不会改变“先测量”的原则。`})}),`
`,(0,n.jsx)(f,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`Render 计算 UI；Commit 写宿主环境。`}),`
`,(0,n.jsx)(r.li,{children:`组件执行不等于 DOM 一定更新。`}),`
`,(0,n.jsx)(r.li,{children:`优化目标是用户可感知成本，而非单一 render 次数。`}),`
`,(0,n.jsx)(r.li,{children:`用测量结果决定是否 memoize。`}),`
`]})}),`
`,(0,n.jsx)(l,{items:[{label:`React: Render and Commit`,href:`https://react.dev/learn/render-and-commit`},{label:`React: React Developer Tools Profiler`,href:`https://react.dev/reference/react/Profiler`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};