import{d as e,p as t}from"./index-BfATlDky.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,Flow:l,FurtherReading:u,MentalModel:d,Observation:f,Summary:p}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`Flow`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Observation`,!0),p||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`error-boundary--react-19-use把-pending-与-failure-分到不同边界`,children:`Error Boundary + React 19 use：把 pending 与 failure 分到不同边界`}),`
`,(0,n.jsxs)(r.p,{children:[`React 19 的 `,(0,n.jsx)(r.code,{children:`use(resource)`}),` 可以读取 Promise：pending 时 suspend 交给 Suspense，fulfilled 时返回值，rejected 时错误向最近的 Error Boundary 传播。`]}),`
`,(0,n.jsx)(d,{title:`同一资源有三态，两个边界各管一类`,children:`Promise pending → Suspense fallback；fulfilled → 正常 UI；rejected → Error Boundary fallback。Error Boundary 处理 render 阶段传播出的错误，不是所有异步错误的全局 try/catch。`}),`
`,(0,n.jsx)(l,{items:[`稳定 Promise/resource`,`use(resource)`,`pending → Suspense`,`fulfilled → value`,`rejected → Error Boundary`]}),`
`,(0,n.jsx)(c,{title:`切换成功、等待、失败`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 触发资源读取，分别观察 pending fallback、成功内容与 rejection fallback。重新渲染时留意 Promise identity：如果每次 render 都创建新 Promise，会破坏稳定读取/缓存预期。`})}),`
`,(0,n.jsx)(s,{action:`在 Demo 中触发成功、pending 和失败三种资源路径`,observe:`分别查看 Suspense fallback、成功内容和 Error Boundary fallback，并比较稳定 resource identity 对重渲染的影响。`}),`
`,(0,n.jsxs)(f,{children:[(0,n.jsx)(r.code,{children:`use`}),` 与普通 Hook 不完全相同，它可以在条件/循环中调用，但仍必须在组件或 Hook 中使用。生产数据读取通常应依赖框架或缓存层提供稳定资源。`]}),`
`,(0,n.jsx)(i,{title:`render 中无缓存地 new Promise`,children:`每次 render 生成新 Promise 会让资源身份不断变化，可能导致重复请求或持续 suspend。稳定 Promise/缓存是关键边界。`}),`
`,(0,n.jsx)(o,{children:`Error Boundary 不捕获事件 handler、服务端渲染等所有错误类别；需要按 React 的错误传播规则和应用数据层分别处理。`}),`
`,(0,n.jsx)(p,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`use 读取 Promise 可触发 Suspense。`}),`
`,(0,n.jsx)(r.li,{children:`rejection 交给 Error Boundary。`}),`
`,(0,n.jsx)(r.li,{children:`资源 identity 必须稳定。`}),`
`,(0,n.jsx)(r.li,{children:`框架/缓存层负责生产级数据协议。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React: use`,href:`https://react.dev/reference/react/use`},{label:`React: Suspense`,href:`https://react.dev/reference/react/Suspense`},{label:`React: Component Error Boundaries`,href:`https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};