import{n as e,r as t}from"./index-B8CSWDOf.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,Compare:s,DemoReference:c,Experiment:l,FurtherReading:u,MentalModel:d,Observation:f,Summary:p}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`Compare`,!0),c||a(`DemoReference`,!0),l||a(`Experiment`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Observation`,!0),p||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`usecallback-函数引用稳定`,children:`useCallback 函数引用稳定`}),`
`,(0,n.jsx)(d,{title:`useCallback 缓存函数 identity，不缓存函数执行结果`,children:(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`useCallback(fn, deps)`}),` 返回在依赖不变时保持 identity 的函数。它最常见的价值是配合 `,(0,n.jsx)(r.code,{children:`memo`}),` 子组件或其他明确依赖函数 identity 的 API，而不是让函数“更快”。`]})}),`
`,(0,n.jsx)(l,{title:`观察函数 prop 如何击穿 memo`,children:(0,n.jsxs)(r.p,{children:[`在中间 Demo 让 memoized child 接收内联函数与 `,(0,n.jsx)(r.code,{children:`useCallback`}),` 函数，触发父组件无关更新，比较 child render 次数。`]})}),`
`,(0,n.jsx)(c,{action:`切换 callback 策略并更新父级无关 state`,observe:`稳定函数只有在其他 props 也稳定时才帮助 memo 命中。`}),`
`,(0,n.jsxs)(s,{children:[(0,n.jsx)(r.h3,{id:`闭包依赖-state`,children:`闭包依赖 state`}),(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-jsx`,children:`const add = useCallback(() => setItems([...items, next]), [items, next])
`})}),(0,n.jsx)(r.h3,{id:`用-updater-缩小依赖`,children:`用 updater 缩小依赖`}),(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-jsx`,children:`const add = useCallback(() => setItems(items => [...items, next]), [next])
`})})]}),`
`,(0,n.jsx)(f,{children:(0,n.jsx)(r.p,{children:`functional updater 能在“只为计算下一 state 而读取旧 state”时移除一个依赖，但不能为了稳定 identity 而删除真实响应式依赖。`})}),`
`,(0,n.jsx)(i,{title:`给所有 handler 加 useCallback`,children:(0,n.jsx)(r.p,{children:`若函数没有进入 memoized child、Effect dependency 或第三方 identity-sensitive API，稳定它通常没有收益。额外 Hook 反而增加维护成本。`})}),`
`,(0,n.jsx)(o,{title:`Compiler 与手工 callback`,children:(0,n.jsxs)(r.p,{children:[`React Compiler 可自动 memoize 函数，降低常规 `,(0,n.jsx)(r.code,{children:`useCallback`}),` 需求；外部库要求稳定 callback、未编译区域或已测量热点仍可能需要显式控制。`]})}),`
`,(0,n.jsx)(p,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.code,{children:`useCallback`}),` 稳定函数引用，不缓存调用结果。`]}),`
`,(0,n.jsx)(r.li,{children:`它需要一个消费 identity 的边界才有价值。`}),`
`,(0,n.jsx)(r.li,{children:`updater function 可安全缩小部分依赖。`}),`
`,(0,n.jsx)(r.li,{children:`不要通过遗漏依赖制造“稳定”。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React: useCallback`,href:`https://react.dev/reference/react/useCallback`},{label:`React: memo`,href:`https://react.dev/reference/react/memo`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};