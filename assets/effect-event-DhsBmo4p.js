import{d as e,p as t}from"./index-BR2czpYZ.js";var n=t();function r(t){let r={h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,Compare:s,DemoReference:c,Experiment:l,Flow:u,FurtherReading:d,MentalModel:f,Observation:p,Summary:m,Timeline:h}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`Compare`,!0),c||a(`DemoReference`,!0),l||a(`Experiment`,!0),u||a(`Flow`,!0),d||a(`FurtherReading`,!0),f||a(`MentalModel`,!0),p||a(`Observation`,!0),m||a(`Summary`,!0),h||a(`Timeline`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`eventeffect-与-effect-event`,children:`Event、Effect 与 Effect Event`}),`
`,(0,n.jsx)(f,{title:`先问：这段逻辑为什么发生？`,children:(0,n.jsx)(r.p,{children:`如果逻辑因为用户做了某个明确动作而发生，它通常属于 Event Handler；如果逻辑因为组件已经渲染、需要与某个外部系统保持同步而发生，它属于 Effect。Effect Event 用来把 Effect 中“需要读取最新值、但不应成为重新同步依赖”的非响应式部分拆出来。`})}),`
`,(0,n.jsx)(r.h2,{id:`三种职责不是三个放代码的位置`,children:`三种职责不是三个“放代码的位置”`}),`
`,(0,n.jsxs)(s,{children:[(0,n.jsx)(r.h3,{id:`event-handler`,children:`Event Handler`}),(0,n.jsx)(r.p,{children:`由具体交互触发，例如点击“发送”、提交表单、选择文件。即使组件重新 render，只要用户没有再次触发事件，这段逻辑就不应自动重跑。`}),(0,n.jsx)(r.h3,{id:`effect`,children:`Effect`}),(0,n.jsx)(r.p,{children:`由“当前渲染结果需要和外部系统同步”触发，例如连接聊天室、订阅浏览器 API、同步媒体播放器。依赖变化意味着同步关系需要重新建立。`}),(0,n.jsx)(r.h3,{id:`effect-event`,children:`Effect Event`}),(0,n.jsx)(r.p,{children:`它仍从 Effect 内调用，但内部可以读取最新 props/state，而这些读取不应让外层 Effect 因它们改变而重新同步。`})]}),`
`,(0,n.jsx)(l,{title:`先改主题，再观察连接次数`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 中观察一个 Effect 同时依赖连接目标与界面主题时，会不会因为主题变化而发生不必要的重新连接；再观察把非响应式通知逻辑放进 Effect Event 后，连接生命周期如何变化。`})}),`
`,(0,n.jsx)(c,{action:`改变与连接无关的 UI 状态，再改变真正的连接目标`,observe:`区分哪些变化应该重新同步外部系统，哪些变化只需要读取最新值。`}),`
`,(0,n.jsx)(u,{items:[`用户点击 / 输入 / 提交 → Event Handler`,`组件呈现后必须与外部系统保持一致 → Effect`,`Effect 内某段逻辑要读取最新值，但该值不代表同步条件 → Effect Event`]}),`
`,(0,n.jsx)(p,{children:(0,n.jsx)(r.p,{children:`Effect 的依赖不是“我希望什么时候执行”的手工开关，而是 Effect 所读取的响应式值所形成的同步声明。为了阻止 Effect 重跑而删除真实依赖，会让闭包读取过期值；相反，应先重新划分职责。`})}),`
`,(0,n.jsx)(i,{title:`为了少跑 Effect 而欺骗依赖数组`,children:(0,n.jsx)(r.p,{children:`不要通过遗漏依赖、关闭 lint 或把响应式值藏进 ref 来伪造“只执行一次”。如果某个值确实决定外部同步目标，它就应该是依赖；如果它只是同步发生时需要读取的最新信息，再考虑 Effect Event。`})}),`
`,(0,n.jsx)(o,{title:`Effect Event 不是通用事件系统`,children:(0,n.jsx)(r.p,{children:`Effect Event 只用于 Effect 相关逻辑的职责拆分，不用于替代普通点击 handler，也不应该成为绕过依赖规则的万能容器。能直接在 render 中派生的数据不要放 Effect；能直接在事件中完成的业务动作也不要先写入 state 再用 Effect 间接触发。`})}),`
`,(0,n.jsx)(r.h2,{id:`一个实用判断顺序`,children:`一个实用判断顺序`}),`
`,(0,n.jsx)(h,{steps:[`先判断这段逻辑是否真的需要外部同步；如果只是派生数据，留在 render`,`若由明确用户动作触发，放 Event Handler`,`若由组件呈现状态决定外部连接/订阅，使用 Effect，并完整声明依赖`,`若 Effect 的一小段逻辑需要最新值但该值不应触发重新同步，再抽成 Effect Event`]}),`
`,(0,n.jsx)(m,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`Event 回答“用户做了什么”。`}),`
`,(0,n.jsx)(r.li,{children:`Effect 回答“当前 UI 状态需要与哪个外部系统保持同步”。`}),`
`,(0,n.jsx)(r.li,{children:`Effect Event 解决的是 Effect 内响应式与非响应式逻辑的边界。`}),`
`,(0,n.jsx)(r.li,{children:`先重构职责，再讨论依赖数组；不要反过来设计。`}),`
`]})}),`
`,(0,n.jsx)(d,{items:[{label:`React: Separating Events from Effects`,href:`https://react.dev/learn/separating-events-from-effects`},{label:`React: Lifecycle of Reactive Effects`,href:`https://react.dev/learn/lifecycle-of-reactive-effects`},{label:`React: Removing Effect Dependencies`,href:`https://react.dev/learn/removing-effect-dependencies`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};