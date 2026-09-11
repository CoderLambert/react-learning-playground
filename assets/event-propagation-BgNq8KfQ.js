import{n as e,r as t}from"./index-BDXwrHc6.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,FurtherReading:l,MentalModel:u,Summary:d,Timeline:f}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`FurtherReading`,!0),u||a(`MentalModel`,!0),d||a(`Summary`,!0),f||a(`Timeline`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`event-handler-与事件传播`,children:`Event Handler 与事件传播`}),`
`,(0,n.jsx)(u,{title:`事件处理的是一次具体交互的因果链`,children:(0,n.jsxs)(r.p,{children:[`Event Handler 在用户执行具体动作时运行，适合提交、删除、导航等“因为这次动作而发生”的逻辑。事件从目标节点沿 React tree 传播；capture 与 bubble 决定观察阶段，`,(0,n.jsx)(r.code,{children:`stopPropagation`}),` 控制继续传播，`,(0,n.jsx)(r.code,{children:`preventDefault`}),` 控制浏览器默认行为。`]})}),`
`,(0,n.jsx)(c,{title:`观察 capture → target → bubble`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 中点击嵌套区域，比较普通传播、停止传播和阻止默认行为的日志顺序。先预测父子 handler 的执行顺序。`})}),`
`,(0,n.jsx)(s,{action:`触发嵌套点击、stopPropagation 与 preventDefault 示例`,observe:`区分传播是否继续、浏览器默认行为是否发生，以及两者并非同一件事。`}),`
`,(0,n.jsx)(f,{steps:[`capture handler 从外向内观察`,`目标元素 handler 执行`,`bubble handler 从内向外传播`,`若未 preventDefault，浏览器执行默认行为`]}),`
`,(0,n.jsx)(o,{title:`传函数，不要在 render 时调用`,children:(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`onClick={handleClick}`}),` 传递 handler；`,(0,n.jsx)(r.code,{children:`onClick={handleClick()}`}),` 会在 render 中立即调用。需要参数时用函数包装，如 `,(0,n.jsx)(r.code,{children:`onClick={() => handleSelect(id)}`}),`。`]})}),`
`,(0,n.jsx)(i,{title:`用 Effect 间接响应一次点击`,children:(0,n.jsx)(r.p,{children:`若逻辑只因为用户点击而发生，直接放在事件链里。先 set 一个 flag，再让 Effect 观察 flag 去执行同一业务动作，会增加状态、时序和重复执行风险。`})}),`
`,(0,n.jsx)(d,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`Event Handler 表达具体用户动作的因果逻辑。`}),`
`,(0,n.jsx)(r.li,{children:`capture/bubble 描述传播阶段。`}),`
`,(0,n.jsx)(r.li,{children:`stopPropagation 与 preventDefault 解决不同问题。`}),`
`,(0,n.jsx)(r.li,{children:`事件逻辑与 render 纯计算、Effect 外部同步应保持边界。`}),`
`]})}),`
`,(0,n.jsx)(l,{items:[{label:`React: Responding to Events`,href:`https://react.dev/learn/responding-to-events`},{label:`MDN: Event bubbling`,href:`https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};