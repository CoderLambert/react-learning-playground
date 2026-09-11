import{d as e,p as t}from"./index-BR2czpYZ.js";var n=t();function r(t){let r={h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,Flow:l,FurtherReading:u,MentalModel:d,Summary:f}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`Flow`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`state-保留重置与-key-身份`,children:`State 保留、重置与 key 身份`}),`
`,(0,n.jsx)(d,{title:`State 绑定在 render tree 的位置与身份上`,children:(0,n.jsx)(r.p,{children:`State 不是存放在 JSX 标签或组件函数“里面”的独立盒子；React 根据组件在树中的位置、type 与 key 识别身份。同一位置保持同一身份时 state 可保留；身份变化时 React 会卸载旧子树并创建新 state。`})}),`
`,(0,n.jsx)(c,{title:`有意保留或重置表单 state`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 中切换相同位置的内容，再改变 key。先预测输入值会保留还是清空，然后用结果验证身份规则。`})}),`
`,(0,n.jsx)(s,{action:`切换视图并改变 key 策略`,observe:`观察 state 是跟 JSX 外观、数组位置还是 type + key 身份关联。`}),`
`,(0,n.jsx)(l,{items:[`父级 render 产生子节点`,`React 在同级位置比较 type/key`,`身份相同 → 复用组件 state`,`身份不同 → 卸载旧实例`,`新实例获得初始 state`]}),`
`,(0,n.jsx)(o,{title:`key 不只属于列表`,children:(0,n.jsx)(r.p,{children:`列表最常见，但 key 也可以用于显式区分同一位置上的不同业务实体，例如不同聊天对象或编辑表单，从而有意重置其局部 state。`})}),`
`,(0,n.jsx)(i,{title:`在组件函数内部定义组件类型`,children:(0,n.jsx)(r.p,{children:`每次 render 都创建新的组件函数，会让 React 看到不同 type，导致子树 state 意外重置。组件定义通常应放在模块顶层。`})}),`
`,(0,n.jsx)(f,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`State 由 render tree 身份定位。`}),`
`,(0,n.jsx)(r.li,{children:`同位置同 type/key 通常保留 state。`}),`
`,(0,n.jsx)(r.li,{children:`改 key 是显式重置子树的工具。`}),`
`,(0,n.jsx)(r.li,{children:`不要通过嵌套定义组件制造不稳定 type。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React: Preserving and Resetting State`,href:`https://react.dev/learn/preserving-and-resetting-state`},{label:`React: Rendering Lists`,href:`https://react.dev/learn/rendering-lists`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};