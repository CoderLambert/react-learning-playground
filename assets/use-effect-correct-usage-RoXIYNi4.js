import{d as e,p as t}from"./index-CvFUQ0Qp.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,FurtherReading:l,MentalModel:u,Observation:d,Summary:f,Timeline:p}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`FurtherReading`,!0),u||a(`MentalModel`,!0),d||a(`Observation`,!0),f||a(`Summary`,!0),p||a(`Timeline`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`useeffect让-react-与外部系统保持同步`,children:`useEffect：让 React 与外部系统保持同步`}),`
`,(0,n.jsx)(r.p,{children:`Effect 的核心职责不是“State 变化后执行代码”，而是把 React 当前提交的状态同步到 React 之外的系统，并在下一次同步或卸载时撤销旧连接。`}),`
`,(0,n.jsx)(u,{title:`Effect 是同步过程，不是生命周期回调`,children:(0,n.jsx)(r.p,{children:`把每个 Effect 想成独立的 start/stop 协议：setup 根据当前 reactive values 建立同步；cleanup 撤销上一轮同步；依赖变化后先 cleanup 再用新值 setup。`})}),`
`,(0,n.jsx)(p,{steps:[`render 计算 UI`,`commit 更新 DOM`,`Effect setup 与外部系统同步`,`依赖变化`,`旧 cleanup`,`新 setup`,`unmount 时最终 cleanup`]}),`
`,(0,n.jsx)(c,{title:`观察两个真实外部同步边界`,children:(0,n.jsxs)(r.p,{children:[`先挂载 resize watcher，缩放窗口确认浏览器事件订阅正在工作；再卸载 watcher，确认这个订阅随组件一起被撤销。然后修改未读数，直接观察浏览器标签标题如何跟随 `,(0,n.jsx)(r.code,{children:`pageTitleBadge`}),` 同步。前一个实验强调 setup/cleanup 对称性，后一个实验强调依赖值变化后 Effect 会用最新提交状态再次同步外部系统。`]})}),`
`,(0,n.jsx)(s,{action:`挂载/卸载 resize watcher、触发 resize 并修改未读数`,observe:`确认事件监听随组件卸载而清理，并观察 document.title 随最新 pageTitleBadge 同步。`}),`
`,(0,n.jsxs)(d,{children:[`开发环境 Strict Mode 可能额外执行一次 setup → cleanup → setup，用来暴露缺失 cleanup 的问题；正确 Effect 应能承受这个序列。当前 Demo 没有把 Effect setup/cleanup 本身写成生命周期日志，因此不要把按钮点击时的提示文字当作 Effect instrumentation；以订阅是否仍工作、`,(0,n.jsx)(r.code,{children:`document.title`}),` 是否同步为实际观察结果。`]}),`
`,(0,n.jsx)(i,{title:`把业务事件绕成 Effect`,children:`用户点击导致的提交、购买、通知等因果明确的动作，应在 Event Handler 中执行；不要先 setState 再让 Effect 猜测“发生了什么”。`}),`
`,(0,n.jsx)(o,{children:`如果没有外部系统需要同步，先尝试在 render 中派生数据或在事件中直接处理。Effect 是 escape hatch，而不是默认的数据流工具。`}),`
`,(0,n.jsx)(f,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`Effect 同步外部系统。`}),`
`,(0,n.jsx)(r.li,{children:`cleanup 撤销上一轮同步。`}),`
`,(0,n.jsx)(r.li,{children:`依赖描述代码实际读取的 reactive values。`}),`
`,(0,n.jsx)(r.li,{children:`无外部系统时通常不需要 Effect。`}),`
`]})}),`
`,(0,n.jsx)(l,{items:[{label:`React: Synchronizing with Effects`,href:`https://react.dev/learn/synchronizing-with-effects`},{label:`React: useEffect`,href:`https://react.dev/reference/react/useEffect`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};