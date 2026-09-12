import{d as e,p as t}from"./index-xb3vecMa.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,Flow:l,FurtherReading:u,MentalModel:d,Observation:f,Summary:p}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`Flow`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Observation`,!0),p||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`formdata在提交边界读取浏览器表单快照`,children:`FormData：在提交边界读取浏览器表单快照`}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`FormData`}),` 可以从 `,(0,n.jsx)(r.code,{children:`<form>`}),` 收集成功控件的当前值，适合“不必让每次键入都进入 React State”的提交模型。`]}),`
`,(0,n.jsxs)(d,{title:`浏览器先持有字段，提交时转换为领域数据`,children:[`FormData 是传输层快照，不等于你的领域模型。先 `,(0,n.jsx)(r.code,{children:`get/getAll`}),` 读取，再显式完成 number、boolean、枚举和数组等类型转换与验证。`]}),`
`,(0,n.jsx)(l,{items:[`用户编辑 DOM 字段`,`submit`,`new FormData(form)`,`get/getAll/has`,`转换 + 校验`,`领域 payload`]}),`
`,(0,n.jsx)(c,{title:`观察提交边界`,children:(0,n.jsxs)(r.p,{children:[`在中间 Demo 修改标题、优先级、协作者和通知选项。输入期间右侧 React 输出不会跟随每次键入更新；点击提交后，再观察 `,(0,n.jsx)(r.code,{children:`FormData`}),` 如何一次性读取当前字段，并经 `,(0,n.jsx)(r.code,{children:`get()`}),`、`,(0,n.jsx)(r.code,{children:`getAll()`}),`、`,(0,n.jsx)(r.code,{children:`has()`}),` 转换成业务 payload。`]})}),`
`,(0,n.jsx)(s,{action:`填写标题、优先级、协作者和通知选项后提交`,observe:`比较输入期间不更新的 React 输出与提交后的 FormData payload，确认 get/getAll/has 分别承担什么读取职责。`}),`
`,(0,n.jsxs)(f,{children:[(0,n.jsx)(r.code,{children:`get()`}),` 只返回一个同名字段值；checkbox group / multi-select 等多值字段应使用 `,(0,n.jsx)(r.code,{children:`getAll()`}),`。FormData 的值还可能是 `,(0,n.jsx)(r.code,{children:`File`}),`，不能假设全部是 string。`]}),`
`,(0,n.jsxs)(i,{title:`把 FormData 当类型安全领域对象`,children:[`直接 `,(0,n.jsx)(r.code,{children:`Object.fromEntries(formData)`}),` 可能丢失重复键语义，也不会自动把字符串转换为业务类型。`]}),`
`,(0,n.jsx)(o,{children:`是否 controlled 取决于 React 是否必须在提交前实时消费某个字段值。实时验证、条件 UI、即时预览或跨字段联动通常更适合 React State；只关心最终提交快照的字段可以继续由浏览器持有。同一表单可以混合两种所有权，不必二选一。`}),`
`,(0,n.jsx)(p,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`FormData 是提交快照。`}),`
`,(0,n.jsx)(r.li,{children:`多值字段用 getAll。`}),`
`,(0,n.jsx)(r.li,{children:`提交边界做领域转换。`}),`
`,(0,n.jsx)(r.li,{children:`实时联动场景仍可用 controlled State。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`MDN: FormData`,href:`https://developer.mozilla.org/docs/Web/API/FormData`},{label:`React: form`,href:`https://react.dev/reference/react-dom/components/form`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};