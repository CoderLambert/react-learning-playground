import{d as e,p as t}from"./index-D7arEcQ9.js";var n=t();function r(t){let r={h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,FurtherReading:l,MentalModel:u,Summary:d,Timeline:f}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`FurtherReading`,!0),u||a(`MentalModel`,!0),d||a(`Summary`,!0),f||a(`Timeline`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`trigger--render--commit`,children:`Trigger → Render → Commit`}),`
`,(0,n.jsx)(u,{title:`render 是计算，commit 才是应用变化`,children:(0,n.jsx)(r.p,{children:`一次 UI 更新可以拆成 Trigger、Render、Commit。Trigger 请求更新；Render 调用组件计算下一棵 UI；Commit 把必要变化应用到 DOM。浏览器随后才有机会 paint。组件 render 了，不代表对应 DOM 一定改变。`})}),`
`,(0,n.jsx)(c,{title:`区分 render 次数与 DOM 变化`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 中触发不同更新，观察 render 日志与实际 DOM。找出“组件重新执行但 DOM 输出保持不变”的情况。`})}),`
`,(0,n.jsx)(s,{action:`触发 Demo 中不同状态更新并观察日志`,observe:`分别记录 trigger、组件执行和可见 DOM 变化，不把三者混成一次操作。`}),`
`,(0,n.jsx)(f,{steps:[`Trigger：初始挂载或 state 更新`,`Render：React 调用组件计算元素树`,`Reconciliation：确定需要提交的差异`,`Commit：更新 DOM / refs 等`,`Browser Paint：浏览器绘制像素`]}),`
`,(0,n.jsx)(o,{title:`render 可以被重复或放弃`,children:(0,n.jsx)(r.p,{children:`现代 React 可以为了调度而多次计算 render；因此 render 必须纯净。不要依赖“组件函数只执行一次”来保证业务正确性。`})}),`
`,(0,n.jsx)(i,{title:`用 render 次数直接推断性能问题`,children:(0,n.jsx)(r.p,{children:`重新 render 并不等于昂贵 DOM 操作。优化前应使用 Profiler 定位实际耗时，并理解 commit 是否真的发生了高成本变化。`})}),`
`,(0,n.jsx)(d,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`Trigger 请求工作，Render 计算 UI，Commit 修改宿主环境。`}),`
`,(0,n.jsx)(r.li,{children:`render ≠ DOM update ≠ browser paint。`}),`
`,(0,n.jsx)(r.li,{children:`render 纯净是 React 可重试计算的基础。`}),`
`,(0,n.jsx)(r.li,{children:`性能判断应基于测量，而非只数 render 次数。`}),`
`]})}),`
`,(0,n.jsx)(l,{items:[{label:`React: Render and Commit`,href:`https://react.dev/learn/render-and-commit`},{label:`React: Keeping Components Pure`,href:`https://react.dev/learn/keeping-components-pure`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};