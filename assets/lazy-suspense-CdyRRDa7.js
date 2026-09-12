import{d as e,p as t}from"./index-DrnE34xg.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,FurtherReading:l,MentalModel:u,Observation:d,Summary:f,Timeline:p}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`FurtherReading`,!0),u||a(`MentalModel`,!0),d||a(`Observation`,!0),f||a(`Summary`,!0),p||a(`Timeline`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`lazy--suspense把代码加载变成可声明的等待边界`,children:`lazy + Suspense：把代码加载变成可声明的等待边界`}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`lazy`}),` 延迟加载组件模块；当组件代码尚未就绪时，它会 suspend，最近的 `,(0,n.jsx)(r.code,{children:`<Suspense>`}),` boundary 显示 fallback，模块加载完成后再 reveal 内容。`]}),`
`,(0,n.jsxs)(u,{title:`lazy 决定代码何时请求，Suspense 决定等待时显示什么`,children:[`Code splitting 是打包/加载边界；Suspense 是 UI 协调边界。两者组合后，加载状态不需要手工 `,(0,n.jsx)(r.code,{children:`isLoading`}),` 包裹 lazy module。`]}),`
`,(0,n.jsx)(p,{steps:[`首次 render lazy component`,`触发动态 import`,`组件 suspend`,`最近 Suspense fallback commit`,`module resolve`,`React retry render`,`真实内容 reveal`]}),`
`,(0,n.jsx)(c,{title:`观察首次与再次打开`,children:(0,n.jsxs)(r.p,{children:[`运行中间 Demo 首次打开 LazyLessonPanel，记录 fallback；这里约 900ms 的等待是 Demo 人为加入的教学延迟，不是 React 或 `,(0,n.jsx)(r.code,{children:`lazy`}),` 固定的加载时序。关闭再打开，观察同一 `,(0,n.jsx)(r.code,{children:`lazy(load)`}),` 声明通常不再经历相同的首次代码加载过程。`]})}),`
`,(0,n.jsx)(s,{action:`首次打开并关闭 LazyLessonPanel，再次打开`,observe:`比较首次打开的 Suspense fallback 与再次打开时的缓存结果；不要把普通 Effect fetch 自动等同于 Suspense 资源。`}),`
`,(0,n.jsxs)(d,{children:[(0,n.jsx)(r.code,{children:`lazy`}),` 应在模块顶层声明。React 会缓存该 `,(0,n.jsx)(r.code,{children:`lazy(load)`}),` 的 loader Promise 与解析后的模块结果，因此同一声明的 `,(0,n.jsx)(r.code,{children:`load`}),` 不会被重复调用；若在组件 render 内创建新的 lazy component identity，可能导致重复初始化和 State 重置。`]}),`
`,(0,n.jsx)(i,{title:`把所有页面包进一个巨大 fallback`,children:`过大的 Suspense boundary 会让局部资源等待时隐藏过多已可用 UI。边界应匹配产品希望一起 reveal 的视觉单元。`}),`
`,(0,n.jsxs)(o,{children:[`Suspense 能协调支持 Suspense 的资源；普通 Effect 中发起的 fetch 不会因为外面套了 Suspense 就自动被追踪。若 `,(0,n.jsx)(r.code,{children:`lazy`}),` 的 loader Promise rejection，React 会把 rejection 交给最近的 Error Boundary 处理，而不是把它当成一次成功 reveal。`]}),`
`,(0,n.jsx)(f,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`lazy 延迟模块加载。`}),`
`,(0,n.jsx)(r.li,{children:`Suspense 提供等待 UI。`}),`
`,(0,n.jsxs)(r.li,{children:[`React 缓存同一 `,(0,n.jsx)(r.code,{children:`lazy(load)`}),` 的 Promise 与解析结果。`]}),`
`,(0,n.jsx)(r.li,{children:`loader rejection 进入最近的 Error Boundary 处理路径。`}),`
`,(0,n.jsx)(r.li,{children:`边界按 reveal 体验设计。`}),`
`]})}),`
`,(0,n.jsx)(l,{items:[{label:`React: lazy`,href:`https://react.dev/reference/react/lazy`},{label:`React: Suspense`,href:`https://react.dev/reference/react/Suspense`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};