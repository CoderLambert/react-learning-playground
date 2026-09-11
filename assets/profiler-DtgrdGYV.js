import{d as e,p as t}from"./index-B4AkXXb7.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,Flow:l,FurtherReading:u,MentalModel:d,Observation:f,Summary:p}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`Flow`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Observation`,!0),p||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`profiler先测量再优化`,children:`Profiler：先测量，再优化`}),`
`,(0,n.jsx)(d,{title:`性能优化从证据开始`,children:(0,n.jsxs)(r.p,{children:[`React `,(0,n.jsx)(r.code,{children:`<Profiler>`}),` 测量某棵 React 子树 commit 时的 render 成本。`,(0,n.jsx)(r.code,{children:`actualDuration`}),` 表示本次更新实际花费，`,(0,n.jsx)(r.code,{children:`baseDuration`}),` 估计没有 memoization 时整棵子树的基准成本；它们用于比较趋势，不是浏览器完整性能时间线。`]})}),`
`,(0,n.jsx)(c,{title:`制造热点并比较优化前后`,children:(0,n.jsxs)(r.p,{children:[`在中间 Demo 调高工作量，记录多次交互的 `,(0,n.jsx)(r.code,{children:`actualDuration`}),` / `,(0,n.jsx)(r.code,{children:`baseDuration`}),`；再启用示例优化，比较相同操作，而不是只看一次偶然值。`]})}),`
`,(0,n.jsx)(s,{action:`执行相同交互序列并比较 Profiler 记录`,observe:`关注重复样本、最慢 commit 与优化前后的趋势。`}),`
`,(0,n.jsx)(l,{items:[`复现用户可感知的慢操作`,`Profiler 定位昂贵 React 子树/commit`,`浏览器 Performance 继续检查脚本、布局、绘制`,`做最小优化`,`用同一场景重新测量并防止回归`]}),`
`,(0,n.jsx)(f,{children:(0,n.jsx)(r.p,{children:`Profiler 只覆盖 React render/commit 相关信息。网络、长任务、布局、图片解码、第三方脚本等仍需浏览器 Performance/Network 工具。`})}),`
`,(0,n.jsx)(i,{title:`根据开发环境单次数字下结论`,children:(0,n.jsx)(r.p,{children:`开发模式、Strict Mode、机器负载都会影响数字。使用一致环境和重复样本；需要接近真实用户时应验证 production build。`})}),`
`,(0,n.jsx)(o,{title:`优化目标是交互体验`,children:(0,n.jsx)(r.p,{children:`减少某个组件的 render 次数不一定改善 INP 或页面响应；若瓶颈在 DOM、布局或网络，React memoization 可能无效。`})}),`
`,(0,n.jsx)(p,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`Profiler 用于定位和验证，不用于猜测。`}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.code,{children:`actualDuration`}),` 与 `,(0,n.jsx)(r.code,{children:`baseDuration`}),` 应结合场景解释。`]}),`
`,(0,n.jsx)(r.li,{children:`React Profiler 与浏览器性能工具互补。`}),`
`,(0,n.jsx)(r.li,{children:`优化后必须用相同场景重新测量。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React: Profiler`,href:`https://react.dev/reference/react/Profiler`},{label:`React DevTools Profiler`,href:`https://react.dev/learn/react-developer-tools`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};