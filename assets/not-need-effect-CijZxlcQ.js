import{d as e,p as t}from"./index-DVrbRnHa.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,Compare:s,DemoReference:c,Experiment:l,FurtherReading:u,MentalModel:d,Observation:f,Summary:p}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`Compare`,!0),c||a(`DemoReference`,!0),l||a(`Experiment`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Observation`,!0),p||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`you-might-not-need-an-effect`,children:`You Might Not Need an Effect`}),`
`,(0,n.jsx)(r.p,{children:`很多“同步 State”的 Effect 实际是在复制已有信息。能在 render 中计算的数据，不应再存一份 State 并用 Effect 维护一致性。`}),`
`,(0,n.jsx)(d,{title:`先问：外部系统在哪里？`,children:`如果答案是“没有”，这段逻辑很可能不属于 Effect。React 已经会在 props/state 改变时重新 render，你可以直接计算派生值。`}),`
`,(0,n.jsx)(s,{leftTitle:`通常不需要 Effect`,rightTitle:`通常需要 Effect`,left:[`根据 props/state 计算 fullName`,`过滤/排序列表`,`点击后发请求或提交`,`用 key 重置子树`],right:[`订阅浏览器/第三方 API`,`连接 WebSocket`,`控制非 React widget`,`同步定时器或事件监听`]}),`
`,(0,n.jsx)(l,{title:`从三个真实交互判断 Effect 是否必要`,children:(0,n.jsxs)(r.p,{children:[`在中间 Demo 完成三组实验：① 连续修改搜索词和分类，确认商品列表直接由当前 `,(0,n.jsx)(r.code,{children:`query/category`}),` 在 render 中派生；② 点击“购买”，确认日志由对应 Event Handler 直接产生；③ 先输入留言草稿，再切换用户，确认 `,(0,n.jsx)(r.code,{children:`key={userId}`}),` 让新的组件身份获得新的本地 State。Demo 中的“Effect + 派生 State”代码块只是反模式说明，不是可执行的 render-count 对照实验。`]})}),`
`,(0,n.jsx)(c,{action:`修改搜索词/分类、点击购买并切换用户`,observe:`观察 render 派生列表、Event Handler 购买日志和 key 切换后的草稿重置；不要把静态反模式代码当作性能实验。`}),`
`,(0,n.jsx)(f,{children:`派生值直接计算把事实来源保持为一份。若改成“源 State → render → Effect → 第二份 State”，React 还需要在 Effect 更新 State 后再进行一次 render；官方文档因此建议把这类可计算数据留在 render，而不是额外同步一份 State。`}),`
`,(0,n.jsx)(i,{title:`Effect 驱动内部数据流水线`,children:`多个 Effect 互相 setState 会让因果关系分散，并产生额外 render。把事件因果放回 handler，把可计算数据放回 render。`}),`
`,(0,n.jsxs)(o,{children:[`昂贵计算与“是否需要 Effect”是两个问题。昂贵纯计算仍然是 render 逻辑；必要时再根据测量结果考虑 memoization。`,(0,n.jsx)(r.code,{children:`key`}),` 重置也只适用于产品语义确实是“切换身份后丢弃旧本地状态”的场景；若需要按实体保留草稿，应重新设计 State ownership。`]}),`
`,(0,n.jsx)(p,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`无外部系统先不用 Effect`}),`
`,(0,n.jsx)(r.li,{children:`派生数据在 render 计算`}),`
`,(0,n.jsx)(r.li,{children:`用户动作在 handler 处理`}),`
`,(0,n.jsx)(r.li,{children:`减少重复 State 与同步链`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React: You Might Not Need an Effect`,href:`https://react.dev/learn/you-might-not-need-an-effect`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};