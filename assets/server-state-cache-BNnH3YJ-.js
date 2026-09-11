import{d as e,p as t}from"./index-DSdxAjqj.js";var n=t();function r(t){let r={h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,Flow:l,FurtherReading:u,MentalModel:d,Observation:f,Summary:p}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`Flow`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Observation`,!0),p||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`server-state-cache-生命周期`,children:`Server State Cache 生命周期`}),`
`,(0,n.jsx)(d,{title:`Server State 是远端事实的本地缓存，不是普通 UI State`,children:(0,n.jsx)(r.p,{children:`服务端数据具有异步、共享、可过期和可被其他客户端修改的特征。客户端保存的是某个时间点的缓存视图，因此需要 query identity、fresh/stale、refetch、去重和失效策略。`})}),`
`,(0,n.jsx)(c,{title:`观察缓存从 fresh 到 stale`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 用不同 query key 请求数据，重复请求同一 key，等待其变 stale，再执行 refetch / invalidation，观察请求与缓存日志。`})}),`
`,(0,n.jsx)(s,{action:`切换 query key、重复读取并触发失效`,observe:`相同 identity 可复用缓存/进行中的请求；stale 表示可重新验证，不等于数据立即被删除。`}),`
`,(0,n.jsx)(l,{items:[`query key 描述资源身份`,`读取缓存：fresh 可直接使用`,`缺失或需要重新验证时发请求`,`相同 in-flight identity 可去重`,`响应写入缓存并更新时间`,`mutation 后按领域关系 invalidation/refetch`]}),`
`,(0,n.jsx)(o,{title:`Demo 是概念模型，不是 TanStack Query runtime`,children:(0,n.jsx)(r.p,{children:`中间 Demo 用自建逻辑可视化 server-state 概念；它没有运行 TanStack Query，因此不要把 Demo 的字段名、默认 stale 时间或去重细节当作 TanStack Query API 保证。真实项目应优先采用成熟 server-state 库并遵循其版本文档。`})}),`
`,(0,n.jsx)(i,{title:`把请求结果复制进多个 useState`,children:(0,n.jsx)(r.p,{children:`手工复制容易造成重复缓存、竞态、失效遗漏和 loading/error 组合爆炸。UI-only state 留在 React；远端资源状态交给专门缓存层更容易统一管理。`})}),`
`,(0,n.jsx)(f,{children:(0,n.jsx)(r.p,{children:`“stale”通常意味着缓存仍可展示但允许后台重新验证；“invalidated”表达业务上已不可信。具体状态机与垃圾回收策略由所选库定义。`})}),`
`,(0,n.jsx)(p,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`query key 是 server-state cache 的身份基础。`}),`
`,(0,n.jsx)(r.li,{children:`fresh/stale 描述可信度与重新验证策略。`}),`
`,(0,n.jsx)(r.li,{children:`去重、失效、refetch 是缓存生命周期能力。`}),`
`,(0,n.jsx)(r.li,{children:`Demo 教概念；真实 TanStack Query 行为以其官方文档为准。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`TanStack Query: Important Defaults`,href:`https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults`},{label:`TanStack Query: Query Keys`,href:`https://tanstack.com/query/latest/docs/framework/react/guides/query-keys`},{label:`React: You Might Not Need an Effect`,href:`https://react.dev/learn/you-might-not-need-an-effect`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};