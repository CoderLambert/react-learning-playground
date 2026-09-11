import{n as e,r as t}from"./index-B8CSWDOf.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,Flow:l,FurtherReading:u,MentalModel:d,Summary:f}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`Flow`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`state-结构设计与单一数据源`,children:`State 结构设计与单一数据源`}),`
`,(0,n.jsx)(d,{title:`State 只保存无法从现有输入可靠计算出的最小事实`,children:(0,n.jsx)(r.p,{children:`好的 state model 像规范化的数据模型：相关值一起变化时考虑合并；能由 props/state 计算的值不重复存；同一事实只保留一个 owner。这样 UI 不需要靠 Effect 或多次 setState 去维持副本同步。`})}),`
`,(0,n.jsx)(c,{title:`制造并消除矛盾状态`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 中比较冗余/重复 state 与派生计算方案。尝试让两个副本产生不一致，再观察单一数据源如何消除同步路径。`})}),`
`,(0,n.jsx)(s,{action:`切换不同 state shape 并执行更新`,observe:`寻找是否存在两个字段表达同一事实、是否能组合出不可能状态。`}),`
`,(0,n.jsx)(l,{items:[`列出 UI 所需事实`,`标记可由其他值派生的字段`,`确定唯一 owner`,`删除重复/矛盾 state`,`render 时计算派生值`]}),`
`,(0,n.jsx)(o,{title:`不要为了 DRY 把所有 state 合成一个对象`,children:(0,n.jsx)(r.p,{children:`单一数据源不是“只能有一个 useState”。独立变化、没有一致性约束的值可以分开保存；关键是不要重复表达同一事实或制造必须手工同步的副本。`})}),`
`,(0,n.jsx)(i,{title:`Effect 同步派生 state`,children:(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`fullName`}),` 若能由 `,(0,n.jsx)(r.code,{children:`firstName + lastName`}),` 得到，就在 render 中计算。额外保存 `,(0,n.jsx)(r.code,{children:`fullName`}),` 再用 Effect 同步，会多一次 render，并产生暂时不一致的状态。`]})}),`
`,(0,n.jsx)(f,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`保存最小事实集合，派生值直接计算。`}),`
`,(0,n.jsx)(r.li,{children:`避免矛盾、冗余、重复和过深 state。`}),`
`,(0,n.jsx)(r.li,{children:`每个事实确定唯一 owner。`}),`
`,(0,n.jsx)(r.li,{children:`State shape 是正确性设计，不只是代码风格。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React: Choosing the State Structure`,href:`https://react.dev/learn/choosing-the-state-structure`},{label:`React: You Might Not Need an Effect`,href:`https://react.dev/learn/you-might-not-need-an-effect`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};