import{v as e,w as t}from"./index-B9ox3KQ3.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,FurtherReading:l,MentalModel:u,Observation:d,Summary:f,Timeline:p}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`FurtherReading`,!0),u||a(`MentalModel`,!0),d||a(`Observation`,!0),f||a(`Summary`,!0),p||a(`Timeline`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`re-render--dom-update`,children:`Re-render ≠ DOM Update`}),`
`,(0,n.jsx)(u,{title:`Render 是计算，Commit 才是写 DOM`,children:(0,n.jsx)(r.p,{children:`组件重新执行只表示 React 重新计算下一棵 UI；只有比较结果确实要求宿主环境变化时，Commit 才会修改 DOM。性能分析必须区分“组件执行次数”和“真实 DOM mutation 成本”。`})}),`
`,(0,n.jsx)(r.h2,{id:`跟着-demo-验证`,children:`跟着 Demo 验证`}),`
`,(0,n.jsx)(c,{title:`组件执行次数与 MutationObserver 对照`,children:(0,n.jsxs)(r.p,{children:[`在中间 Demo 先触发无关 State 更新：`,(0,n.jsx)(r.code,{children:`RenderedPreview`}),` 会再次执行，但传给目标节点的文本保持不变。再修改 `,(0,n.jsx)(r.code,{children:`label`}),`，比较组件执行次数与只观察目标 `,(0,n.jsx)(r.code,{children:`<strong>`}),` 的 MutationObserver 记录。`]})}),`
`,(0,n.jsx)(s,{action:`分别触发无关 State 更新和目标文本更新`,observe:`组件函数可以再次执行，而目标 DOM mutation 只在该子树确实需要改写时出现；开发 Strict Mode 可能带来额外组件调用。`}),`
`,(0,n.jsx)(p,{steps:[`state/props/context 变化触发更新`,`React 执行组件并计算下一 UI`,`React 比较前后结果`,`Commit 仅应用必要宿主变化`,`浏览器随后布局、绘制与合成`]}),`
`,(0,n.jsx)(d,{children:(0,n.jsx)(r.p,{children:`“re-render”本身不是 bug。Demo 中的组件执行计数来自组件函数执行点，而 MutationObserver 只证明被观察目标子树是否发生 mutation；它并不等价于整个 React commit 的全局 DOM 变更计数。`})}),`
`,(0,n.jsx)(i,{title:`看到 render 就立即 memo`,children:(0,n.jsxs)(r.p,{children:[`盲目加入 `,(0,n.jsx)(r.code,{children:`memo`}),`、`,(0,n.jsx)(r.code,{children:`useMemo`}),`、`,(0,n.jsx)(r.code,{children:`useCallback`}),` 会增加依赖与认知成本，还可能因为引用不稳定而完全不命中。先用 Profiler 和浏览器性能工具定位瓶颈。`]})}),`
`,(0,n.jsx)(o,{title:`DOM 不变也不代表 render 免费`,children:(0,n.jsx)(r.p,{children:`组件函数、派生计算和子树协调仍可能消耗 CPU；反过来，render 很快时，即使次数较多也未必值得优化。开发环境 Strict Mode 还可能额外调用组件来暴露不纯 render，因此不要把一次点击机械地等同于一次组件执行。React Compiler 也不会改变“先测量”的原则。`})}),`
`,(0,n.jsx)(f,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`Render 计算 UI；Commit 写宿主环境。`}),`
`,(0,n.jsx)(r.li,{children:`组件执行不等于 DOM 一定更新。`}),`
`,(0,n.jsx)(r.li,{children:`MutationObserver 只证明被观察 DOM 子树的 mutation，不是 React commit profiler。`}),`
`,(0,n.jsx)(r.li,{children:`优化目标是用户可感知成本，而非单一 render 次数。`}),`
`]})}),`
`,(0,n.jsx)(l,{items:[{label:`React: Render and Commit`,href:`https://react.dev/learn/render-and-commit`},{label:`React: React Developer Tools Profiler`,href:`https://react.dev/reference/react/Profiler`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};