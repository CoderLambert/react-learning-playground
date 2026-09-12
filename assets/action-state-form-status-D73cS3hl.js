import{d as e,p as t}from"./index-D1uhzPvO.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,Flow:l,FurtherReading:u,MentalModel:d,Observation:f,Summary:p}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`Flow`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Observation`,!0),p||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`useactionstate--useformstatus拆开结果状态和提交状态`,children:`useActionState + useFormStatus：拆开“结果状态”和“提交状态”`}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`useActionState`}),` 管理 Action 返回的状态与 pending；`,(0,n.jsx)(r.code,{children:`useFormStatus`}),` 让表单内部后代读取最近父 `,(0,n.jsx)(r.code,{children:`<form>`}),` 的提交状态与本次数据。`]}),`
`,(0,n.jsxs)(d,{title:`一个管业务结果，一个管表单上下文`,children:[(0,n.jsx)(r.code,{children:`useActionState`}),` 返回 `,(0,n.jsx)(r.code,{children:`[state, dispatchAction, isPending]`}),`；作为 form action 使用时，Action 第一个参数是 previous state，第二个才是 FormData。`,(0,n.jsx)(r.code,{children:`useFormStatus`}),` 则从所在组件的父 form 读取 `,(0,n.jsx)(r.code,{children:`pending/data`}),` 等状态。`]}),`
`,(0,n.jsx)(l,{items:[`form submit`,`dispatchAction(previousState, formData)`,`pending=true`,`Action 返回 next state`,`state 更新`,`pending=false`]}),`
`,(0,n.jsx)(c,{title:`观察 Submit 子组件`,children:(0,n.jsxs)(r.p,{children:[`运行中间 Demo，提交表单并查看外层 Action state 与 Submit 子组件的 form status。注意 `,(0,n.jsx)(r.code,{children:`useFormStatus`}),` 必须在目标 form 的后代中调用，不能在渲染该 form 的同一组件里期待读取自身状态。`]})}),`
`,(0,n.jsx)(s,{action:`在 Demo 中提交表单并观察 Submit 子组件`,observe:`比较外层 Action state、pending 与 form 后代读取到的提交状态；确认 useFormStatus 只读取父 form 上下文。`}),`
`,(0,n.jsx)(f,{children:`Action state 适合承载服务端/业务结果，例如字段错误或成功消息；pending 是过渡状态，不应复制成另一份手工 State。`}),`
`,(0,n.jsxs)(i,{title:`手工同步 isSubmitting`,children:[`如果 Action API 已提供 pending，再用 Effect 维护第二份 `,(0,n.jsx)(r.code,{children:`isSubmitting`}),` 会制造竞争和重复事实来源。`]}),`
`,(0,n.jsxs)(o,{children:[(0,n.jsx)(r.code,{children:`useFormStatus`}),` 是表单上下文 API，不是全局请求状态管理器；跨页面缓存和服务器状态仍应由相应数据层负责。`]}),`
`,(0,n.jsx)(p,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`useActionState 管 Action 结果。`}),`
`,(0,n.jsx)(r.li,{children:`第一个 Action 参数是 previousState。`}),`
`,(0,n.jsx)(r.li,{children:`useFormStatus 读取父 form 状态。`}),`
`,(0,n.jsx)(r.li,{children:`避免复制 pending State。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React: useActionState`,href:`https://react.dev/reference/react/useActionState`},{label:`React DOM: useFormStatus`,href:`https://react.dev/reference/react-dom/hooks/useFormStatus`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};