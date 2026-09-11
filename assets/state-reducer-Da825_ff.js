import{n as e,r as t}from"./index-CsY7VYFf.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,Flow:l,FurtherReading:u,MentalModel:d,Summary:f}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`Flow`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`usereducer-状态机模式`,children:`useReducer 状态机模式`}),`
`,(0,n.jsx)(d,{title:`Reducer 把事件翻译成下一份 state`,children:(0,n.jsxs)(r.p,{children:[`当一个组件有多种相关状态转换时，`,(0,n.jsx)(r.code,{children:`useReducer`}),` 将“发生了什么”与“如何转换”分离：UI dispatch action，纯 reducer 根据 `,(0,n.jsx)(r.code,{children:`(state, action)`}),` 计算 next state。它不会自动让状态全局化，也不是性能优化 API。`]})}),`
`,(0,n.jsx)(c,{title:`按 action 审计状态转换`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 中依次触发不同 action，观察 action 日志、旧 state 与新 state。尝试从 action 名称直接回答“用户/系统发生了什么”。`})}),`
`,(0,n.jsx)(s,{action:`触发 add/update/remove 等 reducer action`,observe:`确认 reducer 不产生副作用，并且每种 action 都返回完整可预测的 next state。`}),`
`,(0,n.jsx)(l,{items:[`Event Handler 决定发生的事件`,`dispatch(action)`,`React 调用 reducer(state, action)`,`reducer 纯计算 next state`,`下一次 render 使用新 state`]}),`
`,(0,n.jsx)(o,{title:`Reducer 必须保持纯净`,children:(0,n.jsx)(r.p,{children:`不要在 reducer 中请求 API、写存储、生成不可控副作用。Reducer 可能在开发检查中被重复调用；其职责是确定性状态转换。`})}),`
`,(0,n.jsx)(i,{title:`为了‘架构感’把简单 state 全部 reducer 化`,children:(0,n.jsxs)(r.p,{children:[`单个独立 boolean 或输入值用 `,(0,n.jsx)(r.code,{children:`useState`}),` 往往更清楚。只有更新规则相互关联、action 类型增多或需要集中审计时，reducer 的结构化收益才明显。`]})}),`
`,(0,n.jsx)(f,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`action 描述发生了什么，reducer 描述如何转换。`}),`
`,(0,n.jsx)(r.li,{children:`reducer 是纯函数。`}),`
`,(0,n.jsx)(r.li,{children:`useReducer 适合复杂、相关、可枚举的状态转换。`}),`
`,(0,n.jsx)(r.li,{children:`它改善更新逻辑组织，不自动解决跨组件共享。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React: Extracting State Logic into a Reducer`,href:`https://react.dev/learn/extracting-state-logic-into-a-reducer`},{label:`React: useReducer`,href:`https://react.dev/reference/react/useReducer`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};