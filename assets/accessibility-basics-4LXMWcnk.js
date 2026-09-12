import{d as e,p as t}from"./index-D1uhzPvO.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,DemoReference:s,Experiment:c,Flow:l,FurtherReading:u,MentalModel:d,Observation:f,Summary:p}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`DemoReference`,!0),c||a(`Experiment`,!0),l||a(`Flow`,!0),u||a(`FurtherReading`,!0),d||a(`MentalModel`,!0),f||a(`Observation`,!0),p||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`accessibility-basics先让语义成立再谈-aria`,children:`Accessibility Basics：先让语义成立，再谈 ARIA`}),`
`,(0,n.jsx)(d,{title:`可访问性首先是正确的 Web 语义`,children:(0,n.jsxs)(r.p,{children:[`浏览器不仅把 DOM 画到屏幕，也把语义暴露给 accessibility tree。原生元素已经携带角色、名称、键盘行为和状态约定；优先使用正确 HTML，通常比用 `,(0,n.jsx)(r.code,{children:`div + onClick + ARIA`}),` 更可靠。`]})}),`
`,(0,n.jsx)(l,{items:[`选择与交互语义匹配的原生元素`,`提供可感知的 accessible name / label`,`保证键盘可到达、焦点顺序合理且 focus 可见`,`状态变化通过语义或必要的 ARIA 暴露`,`再用自动化检查 + 键盘 + 屏幕阅读器验证真实体验`]}),`
`,(0,n.jsx)(c,{title:`不用鼠标完成 Demo`,children:(0,n.jsx)(r.p,{children:`只使用 Tab、Shift+Tab、Enter、Space 操作中间 Demo；检查每个交互元素是否可达、焦点是否可见、控件名称是否能从文本/label 推断。然后再查看 DOM，判断是否使用了正确原生元素。`})}),`
`,(0,n.jsx)(s,{action:`键盘遍历并操作 Accessibility Demo`,observe:`焦点顺序、可见焦点、label/heading 结构和按钮/链接语义应与视觉含义一致。`}),`
`,(0,n.jsx)(f,{children:(0,n.jsxs)(r.p,{children:[`ARIA 不会自动增加键盘行为。给 `,(0,n.jsx)(r.code,{children:`div`}),` 加 `,(0,n.jsx)(r.code,{children:`role="button"`}),` 后，你仍要自己实现 focus、Enter/Space、disabled 等完整交互契约；原生 `,(0,n.jsx)(r.code,{children:`<button>`}),` 已经提供这些基础行为。`]})}),`
`,(0,n.jsx)(r.h2,{id:`labelplaceholder-与可见焦点`,children:`Label、Placeholder 与可见焦点`}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`placeholder`}),` 是输入提示，不是稳定的 label：用户开始输入后提示会消失，也不能可靠表达字段名称。表单字段应有持续可识别的 `,(0,n.jsx)(r.code,{children:`<label>`}),` 或等价的 accessible name；提示、格式和错误信息可以作为额外描述关联，而不是用 placeholder 承担字段身份。`]}),`
`,(0,n.jsxs)(r.p,{children:[`如果设计系统覆盖了浏览器默认的 `,(0,n.jsx)(r.code,{children:`outline`}),`，必须提供等价或更清晰的 visible focus indicator，例如明确的 `,(0,n.jsx)(r.code,{children:`:focus-visible`}),` 边框或焦点环。不要让焦点只靠颜色差异或短暂的鼠标样式来表达。`]}),`
`,(0,n.jsx)(r.h2,{id:`live-region-的取舍`,children:`Live Region 的取舍`}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`aria-live`}),` / `,(0,n.jsx)(r.code,{children:`assertive`}),` 不是越多越好。非紧急的状态变化通常应允许辅助技术在合适时机播报；只有确实需要立即打断当前朗读的重要信息，才考虑 assertive。重复渲染、频繁进度更新或不必要的 assertive 通知会打断屏幕阅读器用户，降低可用性。`]}),`
`,(0,n.jsx)(r.p,{children:`本 Demo 用 polite status 与 assertive error 展示两种语义通道；学习者可以从 Demo 的 DOM 状态看到这种映射，但这不代表每条生产错误消息都应该抢占播报。真实产品仍要按信息紧急程度、重复频率和用户任务验证。`}),`
`,(0,n.jsx)(i,{title:`No ARIA is better than bad ARIA`,children:(0,n.jsxs)(r.p,{children:[`错误 role、错误 `,(0,n.jsx)(r.code,{children:`aria-*`}),` 状态或重复 label 会让辅助技术得到比纯 HTML 更错误的信息。ARIA 应补充缺失语义，而不是覆盖本来正确的原生语义。`]})}),`
`,(0,n.jsx)(o,{title:`自动化测试不能证明完整可访问性`,children:(0,n.jsx)(r.p,{children:`axe 等规则可以发现大量确定性问题，但无法判断所有交互是否符合用户任务、朗读顺序是否自然、复杂组件是否真正可操作。axe ≠ 完整 accessibility 验收；keyboard ≠ screen reader；automated checks ≠ 实际辅助技术。生产验收仍需要键盘测试，并对关键流程进行真实屏幕阅读器验证。`})}),`
`,(0,n.jsx)(p,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`原生语义优先，ARIA 用于补充而不是替代 HTML。`}),`
`,(0,n.jsx)(r.li,{children:`accessible name、键盘可达、focus 可见是基础要求。`}),`
`,(0,n.jsx)(r.li,{children:`视觉顺序与 DOM/焦点顺序应尽量一致。`}),`
`,(0,n.jsx)(r.li,{children:`自动化 + 键盘 + 辅助技术测试共同构成验证链路。`}),`
`]})}),`
`,(0,n.jsx)(u,{items:[{label:`WAI-ARIA Authoring Practices`,href:`https://www.w3.org/WAI/ARIA/apg/`},{label:`MDN: Accessibility`,href:`https://developer.mozilla.org/docs/Web/Accessibility`},{label:`WCAG 2.2`,href:`https://www.w3.org/TR/WCAG22/`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};