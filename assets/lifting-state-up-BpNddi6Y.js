import{d as e,p as t}from"./index-D7arEcQ9.js";var n=t();function r(t){let r={h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,Flow:l,FurtherReading:u,MentalModel:d,Summary:f}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`Flow`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`状态提升与协同联动`,children:`状态提升与协同联动`}),`
`,(0,n.jsx)(d,{title:`共享状态放到需要协调它的最近共同祖先`,children:(0,n.jsx)(r.p,{children:`当两个兄弟组件必须基于同一事实保持一致时，不要让它们各存一份副本再互相同步。把 state 提升到最近共同父节点，由父级持有唯一事实，再通过 props 下发值、callback 上报事件。`})}),`
`,(0,n.jsx)(c,{title:`让两个兄弟组件共享同一事实`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 中修改任一输入/面板，观察另一个兄弟如何同步。对比“各自 state”与“父级单一 state”的行为。`})}),`
`,(0,n.jsx)(s,{action:`从不同子组件触发更新`,observe:`追踪事件向上、数据向下的闭环，确认兄弟之间没有直接互相修改。`}),`
`,(0,n.jsx)(l,{items:[`识别必须一致的兄弟状态`,`找到最近共同祖先`,`把事实提升为父级 state`,`value 向下传`,`事件 callback 向上报告`]}),`
`,(0,n.jsx)(o,{title:`不要把 state 提升得比需要更高`,children:(0,n.jsx)(r.p,{children:`提升能解决协调，但过度提升会扩大拥有者职责和更新范围。原则是“最近共同 owner”，而不是统一塞到应用根节点。`})}),`
`,(0,n.jsx)(i,{title:`双向同步两个本地 state`,children:(0,n.jsx)(r.p,{children:`A 更新后 set B、B 更新后再 set A 的模型会形成重复事实与同步环。应找到真正的 source of truth，其他展示值由它派生。`})}),`
`,(0,n.jsx)(f,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`共享事实只保留一份。`}),`
`,(0,n.jsx)(r.li,{children:`最近共同祖先通常是合适 owner。`}),`
`,(0,n.jsx)(r.li,{children:`数据向下、事件向上形成可追踪闭环。`}),`
`,(0,n.jsx)(r.li,{children:`状态提升是协调工具，不是把所有 state 全局化。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React: Sharing State Between Components`,href:`https://react.dev/learn/sharing-state-between-components`},{label:`React: Choosing the State Structure`,href:`https://react.dev/learn/choosing-the-state-structure`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};