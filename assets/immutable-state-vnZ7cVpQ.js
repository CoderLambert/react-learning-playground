import{n as e,r as t}from"./index-BDXwrHc6.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,Flow:l,FurtherReading:u,MentalModel:d,Summary:f}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`Flow`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`对象--数组-state-不可变更新`,children:`对象 / 数组 State 不可变更新`}),`
`,(0,n.jsx)(d,{title:`State 是一次 render 的只读快照，更新要创建下一份值`,children:(0,n.jsx)(r.p,{children:`对象和数组在 JavaScript 中可变，但放入 React state 后应把它们视为只读。更新时创建新的对象/数组，并只替换真正变化的路径；这样旧 snapshot 保持可信，新旧引用也能准确表达“哪里发生了变化”。`})}),`
`,(0,n.jsx)(c,{title:`观察 mutation 与 copy 的引用差异`,children:(0,n.jsx)(r.p,{children:`在中间 Demo 中执行 nested copy、append/remove/replace/sort，关注引用 identity 与 UI 更新。比较原地修改和复制后更新会给 React 留下什么信号。`})}),`
`,(0,n.jsx)(s,{action:`依次执行对象与数组更新操作`,observe:`检查哪些层级引用改变、哪些未变；排序前后是否先复制数组。`}),`
`,(0,n.jsx)(l,{items:[`读取当前 snapshot`,`计算需要变化的路径`,`复制受影响容器`,`写入新值`,`setState 提交新的顶层引用`]}),`
`,(0,n.jsx)(o,{title:`spread 是浅复制`,children:(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`{...obj}`}),` 和 `,(0,n.jsx)(r.code,{children:`[...arr]`}),` 只复制一层。修改嵌套对象时必须从变化节点一路复制到顶层；否则仍可能修改旧 snapshot 共享的对象。`]})}),`
`,(0,n.jsx)(i,{title:`先 mutate 再 set 回同一个引用`,children:(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`state.user.name = x; setState(state)`}),` 既破坏历史 snapshot，又可能因为顶层引用未变而让更新语义失真。数组的 `,(0,n.jsx)(r.code,{children:`push`}),`、`,(0,n.jsx)(r.code,{children:`splice`}),`、原地 `,(0,n.jsx)(r.code,{children:`sort`}),` 同理，应选择非变异操作或先复制。`]})}),`
`,(0,n.jsx)(f,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`React state 中的对象/数组按只读值处理。`}),`
`,(0,n.jsx)(r.li,{children:`更新只复制变化路径，但必须产生新的顶层引用。`}),`
`,(0,n.jsx)(r.li,{children:`spread 是浅复制，不会自动处理嵌套结构。`}),`
`,(0,n.jsx)(r.li,{children:`不可变性保护 snapshot，也让引用比较具有意义。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`React: Updating Objects in State`,href:`https://react.dev/learn/updating-objects-in-state`},{label:`React: Updating Arrays in State`,href:`https://react.dev/learn/updating-arrays-in-state`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};