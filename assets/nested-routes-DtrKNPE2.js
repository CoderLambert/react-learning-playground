import{n as e,r as t}from"./index-B8CSWDOf.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,Flow:l,FurtherReading:u,MentalModel:d,Observation:f,Summary:p}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`Flow`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Observation`,!0),p||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`nested-routes让-url-层级映射-ui-层级`,children:`Nested Routes：让 URL 层级映射 UI 层级`}),`
`,(0,n.jsx)(d,{title:`嵌套路由是布局树与页面树的组合协议`,children:(0,n.jsx)(r.p,{children:`父路由负责稳定布局与父级上下文，子路由负责变化的局部内容。一次导航不必把整页理解为“换掉”；Router 根据新的匹配链决定哪些布局继续存在、哪个 outlet 区域替换。`})}),`
`,(0,n.jsx)(l,{items:[`URL 进入 Router`,`Router 从父到子计算匹配链`,`父 route 渲染共享 layout`,`Outlet/children 位置承接子 route`,`导航到兄弟子路由时，稳定父层可以保留，子层按新匹配更新`]}),`
`,(0,n.jsx)(c,{title:`观察父布局是否真的需要重建`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 中依次进入父路由的多个子页面，关注共享导航/布局与子区域。再用浏览器历史导航，判断哪些 UI 属于父级稳定结构，哪些属于子 route 内容。`})}),`
`,(0,n.jsx)(s,{action:`在多个 nested route 间导航`,observe:`比较父 layout 与 outlet 内容的生命周期和状态边界。`}),`
`,(0,n.jsx)(f,{children:(0,n.jsx)(r.p,{children:`嵌套路由的核心不是“URL 多了斜杠”，而是把信息架构显式编码成 route tree。这样布局、数据边界、错误边界和 pending UI 都可以沿匹配层级组织。`})}),`
`,(0,n.jsx)(i,{title:`用 pathname 字符串手写页面分支`,children:(0,n.jsxs)(r.p,{children:[`在一个巨型组件里写 `,(0,n.jsx)(r.code,{children:`pathname.startsWith(...)`}),` 会把匹配、参数解析、布局与页面逻辑重新耦合。成熟 Router 已经提供 route tree、params、outlet 与导航语义，应使用它们表达页面结构。`]})}),`
`,(0,n.jsx)(o,{title:`组件组合与 Router 匹配是两层职责`,children:(0,n.jsx)(r.p,{children:`React 能组合父子组件，但不会根据 URL 自动选择组件树。Nested routing、layout route、index route、loader 继承等都是具体 Router/Framework 的能力；不同 Router 的细节不能互换套用。`})}),`
`,(0,n.jsx)(p,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`Nested route 把 URL 层级映射为可组合的页面/布局层级。`}),`
`,(0,n.jsx)(r.li,{children:`父 route 管稳定结构，子 route 管局部变化。`}),`
`,(0,n.jsx)(r.li,{children:`Outlet 是路由匹配结果进入父布局的插槽，而不是普通条件渲染的别名。`}),`
`,(0,n.jsx)(r.li,{children:`用 route tree 表达信息架构，避免手写 pathname 分支。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React Router: Routing`,href:`https://reactrouter.com/start/declarative/routing`},{label:`React Router: Outlet`,href:`https://reactrouter.com/api/components/Outlet`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};