import{d as e,p as t}from"./index-DV7uyeF1.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,Flow:l,FurtherReading:u,MentalModel:d,Observation:f,Summary:p}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`Flow`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Observation`,!0),p||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`controlled-form让-react-state-成为字段事实来源`,children:`Controlled Form：让 React State 成为字段事实来源`}),`
`,(0,n.jsxs)(r.p,{children:[`受控表单把 `,(0,n.jsx)(r.code,{children:`value`}),`/`,(0,n.jsx)(r.code,{children:`checked`}),` 交给 React State，并通过 `,(0,n.jsx)(r.code,{children:`onChange`}),` 把用户输入写回 State，因此界面值由 React 数据流决定。`]}),`
`,(0,n.jsx)(d,{title:`value + onChange 是一个闭环`,children:`浏览器产生输入事件 → handler 更新 State → React render 新 value → DOM 显示新值。字段本身不是第二份事实来源。`}),`
`,(0,n.jsx)(l,{items:[`input event`,`onChange`,`setState`,`render 派生校验`,`commit value/checked`,`submit 读取当前 State 快照`]}),`
`,(0,n.jsx)(c,{title:`实时校验与 reset`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 修改 input、textarea、select、checkbox 和 radio，观察派生 validation 如何立即更新；提交后查看快照，再执行 reset，确认所有字段由同一 State 模型恢复。`})}),`
`,(0,n.jsx)(s,{action:`编辑各类受控字段、提交表单，再点击 reset`,observe:`比较实时校验与提交快照，并确认 input、textarea、select、checkbox 和 radio 都从同一 React State 恢复。`}),`
`,(0,n.jsx)(f,{children:`实时联动、条件禁用、即时校验和跨字段计算是 controlled form 的优势；代价是每次输入都会进入 React 更新路径。`}),`
`,(0,n.jsxs)(i,{title:`重复保存可派生校验`,children:[`不要把 `,(0,n.jsx)(r.code,{children:`isValid`}),`、`,(0,n.jsx)(r.code,{children:`fullName`}),` 等可从字段 State 计算的值再存一份 State 并用 Effect 同步。`]}),`
`,(0,n.jsx)(o,{children:`不需要实时 React 协调的简单表单可以让 DOM 持有值，在提交时用 FormData 读取；controlled 不是所有表单的唯一正确答案。`}),`
`,(0,n.jsx)(p,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`State 是受控字段事实来源。`}),`
`,(0,n.jsx)(r.li,{children:`onChange 闭合数据流。`}),`
`,(0,n.jsx)(r.li,{children:`校验优先派生计算。`}),`
`,(0,n.jsx)(r.li,{children:`按交互需求选择 controlled 程度。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React: input`,href:`https://react.dev/reference/react-dom/components/input`},{label:`React: select`,href:`https://react.dev/reference/react-dom/components/select`},{label:`React: textarea`,href:`https://react.dev/reference/react-dom/components/textarea`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};