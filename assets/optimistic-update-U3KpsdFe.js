import{v as e,w as t}from"./index-B9ox3KQ3.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,FurtherReading:l,MentalModel:u,Observation:d,Summary:f,Timeline:p}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`FurtherReading`,!0),u||a(`MentalModel`,!0),d||a(`Observation`,!0),f||a(`Summary`,!0),p||a(`Timeline`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`useoptimistic在-action-pending-期间展示临时未来`,children:`useOptimistic：在 Action pending 期间展示临时未来`}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`useOptimistic`}),` 让界面在 Action 尚未完成时先显示一个 optimistic state；Action 完成后，视图重新以传入的 canonical value 为基础收敛。`]}),`
`,(0,n.jsx)(u,{title:`Optimistic state 是临时投影，不是第二个数据库`,children:`真实状态仍是 canonical source。乐观层只描述“如果这次 Action 成功，用户希望立即看到什么”。服务端确认时更新真实状态；未确认时 canonical 保持不变，临时投影在 Action 结束后消失。`}),`
`,(0,n.jsx)(p,{steps:[`canonical=A`,`Action 开始`,`addOptimistic → 临时 A'`,`服务器确认 → canonical=A'`,`或业务拒绝且正常返回 → canonical 仍为 A`,`optimistic 层结束`]}),`
`,(0,n.jsx)(c,{title:`确认与业务拒绝两条路径`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 提交评论，先观察临时评论立即出现；勾选“模拟业务拒绝”后再次提交，观察 Action 正常结束但 canonical 未更新时，未确认的临时项自动回退。这个实验没有模拟 Action throw / Error Boundary。`})}),`
`,(0,n.jsx)(s,{action:`提交一条评论，再切换模拟业务拒绝后提交另一条`,observe:`比较 optimistic 项目立即出现、服务端确认后的 canonical 收敛，以及业务拒绝且 Action 正常结束时临时项目的回退。`}),`
`,(0,n.jsx)(d,{children:`乐观 UI 的关键不是“提前 setState”，而是明确 canonical 与 optimistic 两层。只要 canonical 没有被确认更新，Action 结束后 optimistic 投影就会消失，不需要长期维护第二份数组。`}),`
`,(0,n.jsxs)(i,{title:`把 optimistic 结果永久写进两份 State`,children:[`维护 `,(0,n.jsx)(r.code,{children:`realItems`}),` 与 `,(0,n.jsx)(r.code,{children:`optimisticItems`}),` 两套长期 State 会增加合并、去重和回滚复杂度。`]}),`
`,(0,n.jsx)(o,{children:`高风险、不可逆或失败概率高的操作未必适合乐观展示。当前 Demo 的拒绝路径是业务拒绝后正常返回；如果 Action 真正抛异常，还需要另外设计 catch / Error Boundary、重试、幂等性和服务端冲突策略。`}),`
`,(0,n.jsx)(f,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`canonical state 是事实来源。`}),`
`,(0,n.jsx)(r.li,{children:`optimistic state 只在 Action 期间临时存在。`}),`
`,(0,n.jsx)(r.li,{children:`确认后更新真实状态。`}),`
`,(0,n.jsx)(r.li,{children:`业务拒绝且 canonical 不变时会自动回退。`}),`
`,(0,n.jsx)(r.li,{children:`Action throw 是独立的错误处理路径。`}),`
`]})}),`
`,(0,n.jsx)(l,{items:[{label:`React: useOptimistic`,href:`https://react.dev/reference/react/useOptimistic`},{label:`React: useTransition`,href:`https://react.dev/reference/react/useTransition`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};