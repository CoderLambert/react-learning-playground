import{v as e,w as t}from"./index-BQUrGTij.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,FurtherReading:l,MentalModel:u,Observation:d,Summary:f}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`FurtherReading`,!0),u||a(`MentalModel`,!0),d||a(`Observation`,!0),f||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`usememo-昂贵计算缓存`,children:`useMemo 昂贵计算缓存`}),`
`,(0,n.jsx)(u,{title:`useMemo 缓存计算结果，不是语义保证`,children:(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`useMemo(calculate, deps)`}),` 是当前组件实例跨 re-render 的计算缓存，只保存最近一次依赖组合的结果。依赖未变化时 React 可以复用上次计算结果；依赖变化时重新计算。它主要用于跳过可测量的昂贵计算，或在确有 identity 消费者时稳定派生对象。`]})}),`
`,(0,n.jsx)(c,{title:`比较直接计算与缓存计算`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 增加计算规模，分别触发会改变计算依赖和仅改变无关 UI 的更新，观察计算次数与耗时。`})}),`
`,(0,n.jsx)(s,{action:`切换缓存/直接计算并触发两类更新`,observe:`依赖稳定时缓存可跳过计算；依赖变化仍必须重算。`}),`
`,(0,n.jsxs)(d,{children:[(0,n.jsxs)(r.p,{children:[`廉价计算通常直接执行更清晰。`,(0,n.jsx)(r.code,{children:`useMemo`}),` 自身也需要保存缓存并比较依赖；只有计算成本或下游 identity 价值足够高时才值得使用。`]}),(0,n.jsxs)(r.p,{children:[`在 Chapter 07 的统一决策链中，`,(0,n.jsx)(r.code,{children:`useMemo`}),` 是缓存计算或稳定派生 identity 的具体工具，不是测量工具。`]})]}),`
`,(0,n.jsx)(i,{title:`用 useMemo 保证程序正确`,children:(0,n.jsx)(r.p,{children:`React 可以在特定情况下丢弃缓存，因此业务语义不能依赖“这个对象永远是同一个引用”。若需要持久语义，应使用 state/ref 或重新设计数据所有权。`})}),`
`,(0,n.jsx)(o,{title:`Effect 依赖对象的优先级`,children:(0,n.jsxs)(r.p,{children:[`如果 object 只是为了让 Effect dependency 稳定，先考虑把 object 创建移进 Effect，或简化依赖并直接声明真正的 reactive values。不要把 `,(0,n.jsx)(r.code,{children:`object dependency → useMemo`}),` 当默认公式；只有 identity 本身是明确的消费者契约、且测量证明值得时，才使用 `,(0,n.jsx)(r.code,{children:`useMemo`}),`。`]})}),`
`,(0,n.jsx)(o,{title:`React Compiler 可自动缓存部分表达式`,children:(0,n.jsxs)(r.p,{children:[`Compiler 能在构建期自动 memoize 值和组件，减少机械式 `,(0,n.jsx)(r.code,{children:`useMemo`}),`。手工缓存仍可能用于明确的第三方 identity contract、未编译代码或经 Profiler 证实的热点。`]})}),`
`,(0,n.jsx)(f,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.code,{children:`useMemo`}),` 是性能优化，不是状态容器。`]}),`
`,(0,n.jsx)(r.li,{children:`它是当前组件实例里的最近一次计算缓存，不是 application cache、server-state cache 或 request cache。`}),`
`,(0,n.jsx)(r.li,{children:`依赖变化就重算；依赖必须完整。`}),`
`,(0,n.jsx)(r.li,{children:`为了稳定 Effect dependency 中的 object，先考虑移进 Effect 或简化依赖。`}),`
`,(0,n.jsx)(r.li,{children:`先测量昂贵计算，再决定缓存。`}),`
`,(0,n.jsx)(r.li,{children:`Compiler 环境不要机械保留历史式 memoization。`}),`
`]})}),`
`,(0,n.jsx)(l,{items:[{label:`React: useMemo`,href:`https://react.dev/reference/react/useMemo`},{label:`React Compiler`,href:`https://react.dev/learn/react-compiler`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};