import{d as e,p as t}from"./index-DrnE34xg.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,h3:`h3`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,Compare:s,DemoReference:c,Experiment:l,FurtherReading:u,MentalModel:d,Summary:f}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`Compare`,!0),c||a(`DemoReference`,!0),l||a(`Experiment`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`portal-与第三方-dom-生命周期`,children:`Portal 与第三方 DOM 生命周期`}),`
`,(0,n.jsx)(d,{title:`React Tree 与 DOM Tree 是两套结构`,children:(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`createPortal(children, domNode)`}),` 改变的是 DOM 放置位置，children 在 React Tree 中仍属于原父组件：Context 继续沿 React Tree 传播，事件也按 React Tree 冒泡。第三方 DOM 实例则应通过 ref + Effect 与 React 生命周期同步。`]})}),`
`,(0,n.jsx)(l,{title:`跨 DOM 容器观察事件与生命周期`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 打开 Portal，点击 Portal 内元素观察父 React handler；再启停第三方实例，观察 setup/cleanup 日志。`})}),`
`,(0,n.jsx)(c,{action:`打开 Portal、触发事件并反复挂载第三方实例`,observe:`DOM 位置改变但 React 关系不变；第三方资源必须成对创建/销毁。`}),`
`,(0,n.jsxs)(s,{children:[(0,n.jsx)(r.h3,{id:`portal`,children:`Portal`}),(0,n.jsx)(r.p,{children:`由 React 继续拥有子树，只改变宿主 DOM 位置。`}),(0,n.jsx)(r.h3,{id:`第三方-dom-实例`,children:`第三方 DOM 实例`}),(0,n.jsx)(r.p,{children:`外部库拥有自己的命令式状态；React 用 Effect 建立同步边界，并在 cleanup 撤销监听、实例和资源。`})]}),`
`,(0,n.jsx)(i,{title:`让 React 和第三方库同时写同一 DOM 子树`,children:(0,n.jsx)(r.p,{children:`双重所有权容易产生 DOM 被覆盖、事件泄漏和 cleanup 不完整。给第三方库一个明确容器，让其拥有容器内部；React 管理容器本身和实例生命周期。`})}),`
`,(0,n.jsx)(o,{title:`Portal 不自动提供 Modal 可访问性`,children:(0,n.jsx)(r.p,{children:`Portal 只负责放置。Dialog 的 accessible name、focus trap、Escape、背景交互约束与焦点恢复仍需单独实现。`})}),`
`,(0,n.jsx)(f,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`Portal 改 DOM 位置，不改 React 父子关系。`}),`
`,(0,n.jsx)(r.li,{children:`Portal 事件按 React Tree 传播。`}),`
`,(0,n.jsx)(r.li,{children:`第三方实例通过 ref + Effect setup/cleanup 集成。`}),`
`,(0,n.jsx)(r.li,{children:`明确 DOM ownership，避免双方同时管理同一子树。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React: createPortal`,href:`https://react.dev/reference/react-dom/createPortal`},{label:`React: Synchronizing with Effects`,href:`https://react.dev/learn/synchronizing-with-effects`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};