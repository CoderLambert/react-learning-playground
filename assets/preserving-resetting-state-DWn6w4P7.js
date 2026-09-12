import{d as e,p as t}from"./index-DVrbRnHa.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,h2:`h2`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,FurtherReading:l,MentalModel:u,Summary:d}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`FurtherReading`,!0),u||a(`MentalModel`,!0),d||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`state-保留重置与-key你是在继续编辑同一个对象吗`,children:`State 保留、重置与 key：你是在继续编辑同一个对象吗？`}),`
`,(0,n.jsx)(r.p,{children:`State 是否保留，不取决于 JSX 看起来像不像“同一个组件”，而取决于 React 如何识别这棵 render tree 中的组件身份。`}),`
`,(0,n.jsxs)(u,{title:`State 绑定到 render tree 中的组件身份`,children:[(0,n.jsx)(r.p,{children:`React 会结合组件在树中的位置、组件 type，以及同级节点上的 key 来识别身份。身份延续时，局部 State 会延续；身份被替换时，旧子树会卸载，新子树从自己的初始 State 开始。`}),(0,n.jsx)(r.p,{children:`因此“保留还是 reset”本质上是一个产品身份问题：切换到另一个业务实体时，旧的局部 State 应不应该继续属于它？`})]}),`
`,(0,n.jsx)(r.h2,{id:`demo-为什么用聊天草稿`,children:`Demo 为什么用聊天草稿？`}),`
`,(0,n.jsx)(r.p,{children:`聊天和编辑表单最容易暴露身份错误：`}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-text`,children:`Taylor 的 draft = "明天开会"
切换到 Alice
`})}),`
`,(0,n.jsxs)(r.p,{children:[`如果新的 Alice 界面继续显示 Taylor 的草稿，React 本身并没有“记错联系人”。父组件只是在同一个树位置继续渲染同一个 `,(0,n.jsx)(r.code,{children:`Chat`}),` type，所以 React 有理由保留这份局部 `,(0,n.jsx)(r.code,{children:`draft`}),`。`]}),`
`,(0,n.jsxs)(r.p,{children:[`这时真正的问题是：`,(0,n.jsx)(r.strong,{children:`业务上 Alice 是否应该被视为另一个 Chat 身份？`})]}),`
`,(0,n.jsx)(r.h2,{id:`上半区相同位置--相同-typestate-被保留`,children:`上半区：相同位置 + 相同 type，State 被保留`}),`
`,(0,n.jsx)(r.p,{children:`Demo 上半区始终渲染：`}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-jsx`,children:`<Chat contact={preservedContact} />
`})}),`
`,(0,n.jsxs)(r.p,{children:[`切换联系人只改变 `,(0,n.jsx)(r.code,{children:`contact`}),` prop。`,(0,n.jsx)(r.code,{children:`Chat`}),` 仍处在相同父级位置，也仍是同一个组件 type，因此内部 `,(0,n.jsx)(r.code,{children:`draft`}),` 继续存在。`]}),`
`,(0,n.jsxs)(c,{title:`实验 1：观察意外保留`,children:[(0,n.jsx)(r.p,{children:`在上半区：`}),(0,n.jsxs)(r.ol,{children:[`
`,(0,n.jsx)(r.li,{children:`保持 Taylor，输入一段草稿。`}),`
`,(0,n.jsx)(r.li,{children:`点击 Alice。`}),`
`,(0,n.jsx)(r.li,{children:`观察收件人已经变成 Alice，但 textarea 中的草稿仍然保留。`}),`
`]}),(0,n.jsx)(r.p,{children:`这不是 React bug，而是当前树结构表达了“还是同一个 Chat，只是 props 变了”。`})]}),`
`,(0,n.jsx)(r.h2,{id:`下半区key-把业务实体加入组件身份`,children:`下半区：key 把业务实体加入组件身份`}),`
`,(0,n.jsx)(r.p,{children:`Demo 下半区渲染：`}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-jsx`,children:`<Chat key={resetContact.id} contact={resetContact} />
`})}),`
`,(0,n.jsxs)(r.p,{children:[`联系人变化时，`,(0,n.jsx)(r.code,{children:`key`}),` 也变化。React 因此把新旧节点视为不同身份：旧 Chat 被移除，新 Chat 挂载，内部 `,(0,n.jsx)(r.code,{children:`draft`}),` 回到初始值。`]}),`
`,(0,n.jsxs)(c,{title:`实验 2：用业务 key 显式 reset`,children:[(0,n.jsx)(r.p,{children:`在下半区：`}),(0,n.jsxs)(r.ol,{children:[`
`,(0,n.jsx)(r.li,{children:`给 Taylor 输入草稿。`}),`
`,(0,n.jsx)(r.li,{children:`切换到 Alice。`}),`
`,(0,n.jsx)(r.li,{children:`观察 Alice 的 textarea 从空草稿开始。`}),`
`,(0,n.jsx)(r.li,{children:`再切换其他联系人，确认每次身份变化都会创建新的局部 State。`}),`
`]})]}),`
`,(0,n.jsx)(s,{action:`分别在上、下两个 Chat 输入草稿后切换联系人`,observe:`上半区同位置同 type 会保留 draft；下半区 contact.id 作为 key 后会把不同联系人视为不同组件身份并 reset。`}),`
`,(0,n.jsx)(r.h2,{id:`key-不是刷新按钮`,children:`key 不是“刷新按钮”`}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`key`}),` 最常见于列表，但它更根本的作用是帮助 React 区分同级节点身份。`]}),`
`,(0,n.jsx)(r.p,{children:`因此下面这种用法是有业务语义的：`}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-jsx`,children:`<Chat key={contact.id} contact={contact} />
`})}),`
`,(0,n.jsx)(r.p,{children:`它表达的是：`}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-text`,children:`不同 contact.id
= 不同 Chat 身份
= 不共享局部 draft
`})}),`
`,(0,n.jsx)(r.p,{children:`而下面这种写法通常没有稳定业务身份：`}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-jsx`,children:`<Chat key={Math.random()} contact={contact} />
`})}),`
`,(0,n.jsx)(r.p,{children:`随机 key 会让节点几乎每次 render 都变成新身份，导致局部 State、DOM、Effect 生命周期等被反复重建。`}),`
`,(0,n.jsx)(r.h2,{id:`reset-不总是正确答案`,children:`reset 不总是正确答案`}),`
`,(0,n.jsx)(r.p,{children:`有些产品反而希望切换实体后保留各自草稿。例如多标签编辑器、多个会话的草稿缓存，就不能简单依赖“切换时全部 reset”。`}),`
`,(0,n.jsx)(r.p,{children:`那时应该重新设计 owner：`}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-text`,children:`draftsByContactId
  taylor -> "..."
  alice  -> "..."
`})}),`
`,(0,n.jsx)(r.p,{children:`也就是说：`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`如果旧 State 不应该跨实体继承，可以用稳定业务 key reset。`}),`
`,(0,n.jsx)(r.li,{children:`如果每个实体都应该保留自己的 State，应该把草稿提升/归一化到能按实体 ID 保存的位置，而不是靠随机 key 或单个局部 draft 碰运气。`}),`
`]}),`
`,(0,n.jsx)(o,{title:`key 解决的是身份，不是所有重置需求`,children:(0,n.jsx)(r.p,{children:`如果你只是想清空一个字段，显式更新对应 State 往往更直接。只有当“整个子树都应该被视为另一个业务实例”时，用 key 切换身份才特别自然。`})}),`
`,(0,n.jsx)(i,{title:`在组件函数内部定义另一个组件类型`,children:(0,n.jsx)(r.p,{children:`如果每次父组件 render 都重新创建一个新的子组件函数，React 会看到不同的 component type，子树可能反复 reset。组件类型通常应定义在模块顶层；不要用不稳定 type 意外制造身份变化。`})}),`
`,(0,n.jsx)(r.h2,{id:`项目判断规则`,children:`项目判断规则`}),`
`,(0,n.jsx)(r.p,{children:`遇到“为什么 State 没清掉 / 为什么 State 被清掉了”时，按这个顺序检查：`}),`
`,(0,n.jsxs)(r.ol,{children:[`
`,(0,n.jsx)(r.li,{children:`这个组件还在同一个父级位置吗？`}),`
`,(0,n.jsx)(r.li,{children:`组件 type 是否相同？`}),`
`,(0,n.jsx)(r.li,{children:`同级 key 是否相同？`}),`
`,(0,n.jsx)(r.li,{children:`业务上当前对象应该被视为同一实例，还是新的实例？`}),`
`,(0,n.jsx)(r.li,{children:`如果需要每个实体分别保留数据，这份 State 是否应该提升到以实体 ID 为 key 的 owner？`}),`
`]}),`
`,(0,n.jsx)(d,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`State 跟随 render tree 中的组件身份，而不是 JSX 变量名。`}),`
`,(0,n.jsx)(r.li,{children:`相同位置、相同 type、稳定 key 通常会延续局部 State。`}),`
`,(0,n.jsx)(r.li,{children:`稳定业务 key 可以明确表达“这是另一个实例”，从而 reset 子树。`}),`
`,(0,n.jsx)(r.li,{children:`随机 key 不是刷新方案；是否 reset 应由产品身份语义决定。`}),`
`,(0,n.jsx)(r.li,{children:`需要“每个实体各自保留”时，通常应重新设计 State owner，而不是只讨论 key。`}),`
`]})}),`
`,(0,n.jsx)(l,{items:[{label:`React: Preserving and Resetting State`,href:`https://react.dev/learn/preserving-and-resetting-state`},{label:`React: Rendering Lists`,href:`https://react.dev/learn/rendering-lists`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};