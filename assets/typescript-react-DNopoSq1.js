import{d as e,p as t}from"./index-xb3vecMa.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,h2:`h2`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,FurtherReading:l,MentalModel:u,Summary:d}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`FurtherReading`,!0),u||a(`MentalModel`,!0),d||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`typescript-for-react让类型描述边界让运行时负责行为`,children:`TypeScript for React：让类型描述边界，让运行时负责行为`}),`
`,(0,n.jsxs)(r.p,{children:[`这节课不把浏览器 Demo 伪装成 TypeScript 编译器。中间 Demo 负责展示 `,(0,n.jsx)(r.strong,{children:`React 运行时行为和组件 contract 的含义`}),`；Source 面板里的 `,(0,n.jsx)(r.code,{children:`.tsx`}),` 文件负责展示真实类型写法；真正的“这个错误会不会被 TypeScript 拒绝”必须交给 `,(0,n.jsx)(r.code,{children:`tsc`}),` / CI。`]}),`
`,(0,n.jsx)(u,{title:`类型系统检查关系，React 运行时执行行为`,children:(0,n.jsx)(r.p,{children:`TypeScript 能在开发期检查 props、children、事件、ref、状态变体和泛型之间的关系，但它不会改变 React 的 render/commit 语义，也不会在浏览器里替你验证 API、localStorage、URL 或用户输入。先设计可信的组件协议，再用类型系统证明其中能静态证明的部分。`})}),`
`,(0,n.jsx)(r.h2,{id:`先分清三层`,children:`先分清三层`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Demo`}),`：观察受控输入、State 更新、ref 聚焦等真实 React 行为；这里运行的是 JSX/JavaScript，不产生 TypeScript diagnostics。`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Source`}),`：阅读 `,(0,n.jsx)(r.code,{children:`react-boundaries.tsx`}),` 与 `,(0,n.jsx)(r.code,{children:`generic-patterns.tsx`}),`，观察 props、`,(0,n.jsx)(r.code,{children:`ReactNode`}),` / `,(0,n.jsx)(r.code,{children:`ReactElement`}),`、事件、nullable DOM ref、discriminated union、controlled contract 和泛型关系如何写进类型。`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`CI / typecheck`}),`：验证 `,(0,n.jsx)(r.code,{children:`@ts-expect-error`}),` 标记的非法调用确实会报错，同时合法样例持续通过编译。当前仓库的共享 typecheck 脚本由基础设施任务接入，本节不假装浏览器已经完成这项验证。`]}),`
`]}),`
`,(0,n.jsx)(c,{title:`从运行时行为回到类型 contract`,children:(0,n.jsxs)(r.ol,{children:[`
`,(0,n.jsxs)(r.li,{children:[`在中间 Demo 修改输入框，观察 `,(0,n.jsx)(r.code,{children:`onChange → setState → 下一次 render`}),` 的运行时行为。`]}),`
`,(0,n.jsx)(r.li,{children:`点击“通过 ref 聚焦输入框”，确认 ref 解决的是命令式 DOM 访问，而不是状态建模。`}),`
`,(0,n.jsx)(r.li,{children:`切换 Props / Event / State / Ref / Generic 主题，再到 Source 查看对应 TSX 写法。`}),`
`,(0,n.jsxs)(r.li,{children:[`在 Source 中找到 `,(0,n.jsx)(r.code,{children:`@ts-expect-error`}),` 样例：它们是给未来 `,(0,n.jsx)(r.code,{children:`tsc`}),` gate 的静态断言，不是浏览器中的可点击实验。`]}),`
`]})}),`
`,(0,n.jsx)(s,{action:`操作中间 Demo，再切到 Source 阅读真实 TSX contract`,observe:`Demo 证明运行时行为；Source/CI 证明静态关系。两者互补，但不能互相冒充。`}),`
`,(0,n.jsx)(r.h2,{id:`props-与-children只声明真正需要的能力`,children:`Props 与 children：只声明真正需要的能力`}),`
`,(0,n.jsxs)(r.p,{children:[`公共组件应暴露最小、稳定的 props contract。普通可渲染 children 通常使用 `,(0,n.jsx)(r.code,{children:`ReactNode`}),`；只有 API 真正要求“一个 React element 对象”时才收窄到 `,(0,n.jsx)(r.code,{children:`ReactElement`}),`。不要把 `,(0,n.jsx)(r.code,{children:`JSX.Element`}),` 当成所有业务组件 API 的默认返回/children 类型，也不要依赖 TypeScript 去限制“只能传某一种 JSX 标签”——React 官方文档明确指出这种 JSX 子元素种类约束并不能可靠由 TypeScript 表达。`]}),`
`,(0,n.jsx)(r.h2,{id:`event让元素类型保留在-currenttarget-上`,children:`Event：让元素类型保留在 currentTarget 上`}),`
`,(0,n.jsxs)(r.p,{children:[`JSX 内联 handler 往往可以直接推导事件类型；抽出 handler 时，再显式写 `,(0,n.jsx)(r.code,{children:`ChangeEvent<HTMLInputElement>`}),`、`,(0,n.jsx)(r.code,{children:`FormEvent<HTMLFormElement>`}),` 等具体类型。关键不是记住类型名，而是保留“事件来自哪个元素”的关系，这样 `,(0,n.jsx)(r.code,{children:`event.currentTarget.value`}),` 等属性才有可靠类型。`]}),`
`,(0,n.jsx)(r.h2,{id:`state让非法状态难以表达`,children:`State：让非法状态难以表达`}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-ts`,children:`// 容易产生矛盾组合
{ loading?: boolean; data?: User[]; error?: Error }

// 合法状态被编码进类型
{ status: 'loading' }
| { status: 'success'; data: User[] }
| { status: 'error'; error: Error }
`})}),`
`,(0,n.jsx)(r.p,{children:`Discriminated union 的价值不是“更高级”，而是缩小合法状态空间。若一个状态组合在业务上不应该存在，就尽量不要让它轻易通过类型系统。`}),`
`,(0,n.jsx)(r.h2,{id:`ref具体-dom-target--nullable-生命周期`,children:`Ref：具体 DOM target + nullable 生命周期`}),`
`,(0,n.jsxs)(r.p,{children:[`DOM ref 应指向实际元素类型，例如 `,(0,n.jsx)(r.code,{children:`HTMLInputElement`}),`。首次 render 时 DOM 尚未 commit，ref 可能为 `,(0,n.jsx)(r.code,{children:`null`}),`；因此 `,(0,n.jsx)(r.code,{children:`HTMLInputElement | null`}),` 与可选访问不是噪声，而是在描述真实生命周期边界。ref 仍然是 escape hatch，类型正确不代表应该用 ref 取代 props/state 数据流。`]}),`
`,(0,n.jsx)(r.h2,{id:`controlled-contractvalue-是事实callback-是请求`,children:`Controlled contract：value 是事实，callback 是请求`}),`
`,(0,n.jsxs)(r.p,{children:[`对于受控组件，类型可以把 `,(0,n.jsx)(r.code,{children:`value`}),` 与 `,(0,n.jsx)(r.code,{children:`onValueChange`}),` 一起设为必需，防止调用方只给一半 contract。但类型只能保证“callback 存在且参数类型正确”，不能保证父组件一定接受请求、更新 value，也不能保证业务权限正确；这些属于运行时/业务语义。`]}),`
`,(0,n.jsx)(r.h2,{id:`generic只保留真实的输入输出关系`,children:`Generic：只保留真实的输入输出关系`}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`SelectList<T>`}),` 的价值在于 `,(0,n.jsx)(r.code,{children:`items: T[]`}),`、`,(0,n.jsx)(r.code,{children:`renderItem(item: T)`}),`、`,(0,n.jsx)(r.code,{children:`onSelect(item: T)`}),` 共享同一个 `,(0,n.jsx)(r.code,{children:`T`}),`。`,(0,n.jsx)(r.code,{children:`useHistory<T>`}),` 的价值在于 initial/current/update/history 保持同一类型关系。若泛型参数没有连接两个以上真正相关的位置，通常不值得引入。`]}),`
`,(0,n.jsx)(i,{title:`为了消除红线使用 any / as`,children:(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`as`}),` 不会做运行时验证，`,(0,n.jsx)(r.code,{children:`any`}),` 会切断类型关系。API、localStorage、URL、用户输入等 trust boundary 应先做运行时解析/校验，再进入可信的 TypeScript domain；不要把断言当成验证。`]})}),`
`,(0,n.jsx)(o,{title:`静态保证有明确边界`,children:(0,n.jsx)(r.p,{children:`TypeScript 类型在编译后被擦除。它可以证明“调用代码是否满足声明的类型 contract”，但不能证明服务端响应一定诚实、DOM 一定存在、React 组件一定按业务预期更新，也不能替代交互测试。静态检查、运行时校验和 React 行为测试解决的是不同问题。`})}),`
`,(0,n.jsx)(r.h2,{id:`项目决策规则`,children:`项目决策规则`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[`局部值能安全推导：`,(0,n.jsx)(r.strong,{children:`让 TypeScript 推导`}),`，不要为“覆盖率”重复注解。`]}),`
`,(0,n.jsxs)(r.li,{children:[`公共组件输入/输出：`,(0,n.jsx)(r.strong,{children:`明确 props contract`}),`，只暴露真正需要的字段。`]}),`
`,(0,n.jsxs)(r.li,{children:[`多个 boolean/optional 字段存在矛盾组合：考虑 `,(0,n.jsx)(r.strong,{children:`discriminated union`}),`。`]}),`
`,(0,n.jsxs)(r.li,{children:[`抽出的 DOM event handler：保留具体元素事件类型，优先围绕 `,(0,n.jsx)(r.code,{children:`currentTarget`}),` 建模。`]}),`
`,(0,n.jsxs)(r.li,{children:[`DOM ref：使用具体元素 + `,(0,n.jsx)(r.code,{children:`null`}),` 生命周期边界。`]}),`
`,(0,n.jsx)(r.li,{children:`一组 API 需要保持调用方类型关系：使用 generic；否则先不要泛型化。`}),`
`,(0,n.jsx)(r.li,{children:`外部不可信数据：先 runtime validate，再进入静态类型域。`}),`
`,(0,n.jsxs)(r.li,{children:[`要证明错误示例“确实报错”：交给 `,(0,n.jsx)(r.code,{children:`tsc`}),`/CI，而不是浏览器 Demo。`]}),`
`]}),`
`,(0,n.jsx)(d,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`Demo 证明 React 运行时行为；Source 展示类型 contract；CI 才负责真正 typecheck。`}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.code,{children:`ReactNode`}),` 是常见 children 边界，`,(0,n.jsx)(r.code,{children:`ReactElement`}),` 只在确实需要 element 对象时收窄。`]}),`
`,(0,n.jsx)(r.li,{children:`union、具体 event/ref 类型和 controlled props 的目标都是保留真实关系并减少非法状态。`}),`
`,(0,n.jsx)(r.li,{children:`泛型只在需要保存输入输出关系时使用。`}),`
`,(0,n.jsx)(r.li,{children:`TypeScript 不替代运行时校验，也不替代 React 行为测试。`}),`
`]})}),`
`,(0,n.jsx)(l,{items:[{label:`React: Using TypeScript`,href:`https://react.dev/learn/typescript`},{label:`React: Manipulating the DOM with Refs`,href:`https://react.dev/learn/manipulating-the-dom-with-refs`},{label:`TypeScript: Narrowing`,href:`https://www.typescriptlang.org/docs/handbook/2/narrowing.html`},{label:`TypeScript: Generics`,href:`https://www.typescriptlang.org/docs/handbook/2/generics.html`},{label:`TypeScript: @ts-expect-error`,href:`https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#-ts-expect-error-comments`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};