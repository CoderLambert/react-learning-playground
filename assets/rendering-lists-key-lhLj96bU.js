import{d as e,p as t}from"./index-BfATlDky.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,Flow:l,FurtherReading:u,MentalModel:d,Summary:f}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`Flow`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`列表渲染与-key-身份`,children:`列表渲染与 key 身份`}),`
`,(0,n.jsx)(d,{title:`key 告诉 React：这个兄弟节点是谁`,children:(0,n.jsxs)(r.p,{children:[`列表 render 时，React 需要把前后两棵树中的兄弟元素对应起来。`,(0,n.jsx)(r.code,{children:`key`}),` 是同一父节点下的稳定身份线索；它不只是消除 warning，还直接影响组件 state 能否跟随正确的数据实体保留。`]})}),`
`,(0,n.jsx)(c,{title:`排序后检查编辑状态跟谁走`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 中编辑某一行，再排序/插入/删除列表，对比 stable id key 与 index key。操作前先预测输入 state 会留在“数据项”还是“位置”。`})}),`
`,(0,n.jsx)(s,{action:`编辑一行后重排列表，并切换 key 策略`,observe:`观察局部 state 是否跟随正确实体；检查 DOM 顺序变化与组件身份变化的差异。`}),`
`,(0,n.jsx)(l,{items:[`map 产生兄弟元素`,`key 标识同级身份`,`下一次 render 按 type + key 匹配`,`匹配则保留对应 state`,`身份变化则创建/重置子树`]}),`
`,(0,n.jsx)(o,{title:`key 只需在兄弟范围内唯一`,children:(0,n.jsxs)(r.p,{children:[`key 不需要全局唯一，但必须在同一列表中稳定。不要在 render 时用 `,(0,n.jsx)(r.code,{children:`Math.random()`}),` 生成 key；那会让每次 render 都变成新身份。`]})}),`
`,(0,n.jsx)(i,{title:`可重排列表默认使用 index key`,children:(0,n.jsx)(r.p,{children:`只有列表顺序和成员永远不变化、元素也没有需要保持的局部身份时，index 才可能无害。真实可编辑列表通常应使用数据层稳定 id。`})}),`
`,(0,n.jsx)(f,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`key 是 reconciliation 的身份线索。`}),`
`,(0,n.jsx)(r.li,{children:`稳定 key 让 state 跟随数据实体而不是数组位置。`}),`
`,(0,n.jsx)(r.li,{children:`key 变化可被有意用于重置子树。`}),`
`,(0,n.jsx)(r.li,{children:`不要用随机 key 或可变展示字段冒充稳定 id。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React: Rendering Lists`,href:`https://react.dev/learn/rendering-lists`},{label:`React: Preserving and Resetting State`,href:`https://react.dev/learn/preserving-and-resetting-state`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};