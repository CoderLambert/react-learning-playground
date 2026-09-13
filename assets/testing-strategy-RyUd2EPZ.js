import{v as e,w as t}from"./index-BQUrGTij.js";var n=t();function r(t){let r={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,ul:`ul`,...e(),...t.components},{AntiPattern:i,Boundary:o,Compare:s,DemoReference:c,Experiment:l,Flow:u,FurtherReading:d,MentalModel:f,Observation:p,Summary:m}=r;return i||a(`AntiPattern`,!0),o||a(`Boundary`,!0),s||a(`Compare`,!0),c||a(`DemoReference`,!0),l||a(`Experiment`,!0),u||a(`Flow`,!0),d||a(`FurtherReading`,!0),f||a(`MentalModel`,!0),p||a(`Observation`,!0),m||a(`Summary`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:`testing-strategy测试用户可观察行为而不是实现细节`,children:`Testing Strategy：测试用户可观察行为，而不是实现细节`}),`
`,(0,n.jsx)(f,{title:`测试是一组不同反馈速度的证据`,children:(0,n.jsx)(r.p,{children:`单元/组件测试快速验证局部行为，集成测试验证多个边界协作，E2E 从浏览器入口验证关键用户路径。目标不是让每一层重复同一断言，而是用最低成本覆盖最重要的失败模式。`})}),`
`,(0,n.jsx)(u,{items:[`先定义用户可观察结果与风险`,`纯函数/边界逻辑用快速单元测试`,`组件交互用 Testing Library 按角色/名称驱动`,`跨路由、网络、浏览器能力的关键流程交给 Playwright E2E`,`CI 组合 lint/type/build/test，并让失败能定位到责任层`]}),`
`,(0,n.jsx)(l,{title:`从实现断言改成行为断言`,children:(0,n.jsx)(r.p,{children:`查看中间 Demo 给出的测试样例：优先通过 role、accessible name 和用户事件操作 UI；再对比直接查询 class、内部 state 或组件实例的写法。思考重构实现但保持行为时，哪类测试更稳定。`})}),`
`,(0,n.jsx)(c,{action:`对照 RTL 与 Playwright 样例`,observe:`测试应描述用户动作和可见结果，而不是复制组件内部结构。`}),`
`,(0,n.jsx)(p,{children:(0,n.jsxs)(r.p,{children:[`React Testing Library 的核心价值不是“更方便 query DOM”，而是推动测试靠近用户使用方式。`,(0,n.jsx)(r.code,{children:`getByRole`}),` 往往同时验证语义和可访问名称，因此比 class selector 更有产品意义。`]})}),`
`,(0,n.jsxs)(s,{children:[(0,n.jsx)(r.h3,{id:`vitest--rtl`,children:`Vitest + RTL`}),(0,n.jsx)(r.p,{children:`反馈快，适合组件状态、事件、条件 UI 与局部集成；通常运行在模拟 DOM 环境。`}),(0,n.jsx)(r.h3,{id:`playwright`,children:`Playwright`}),(0,n.jsx)(r.p,{children:`真实浏览器，适合导航、焦点、布局、网络、history、跨页面关键路径；成本更高，应聚焦高价值流程。`})]}),`
`,(0,n.jsx)(r.h2,{id:`纯逻辑不必绕道-dom`,children:`纯逻辑不必绕道 DOM`}),`
`,(0,n.jsxs)(r.p,{children:[`用户行为测试不等于所有逻辑都必须经过 DOM。`,(0,n.jsx)(r.code,{children:`reducer`}),`、parser、schema、validator，以及确定性的 state transition 都有清晰的输入/输出，可以直接做快速测试；只有当失败模式属于 UI 语义、交互或浏览器能力时，才需要通过组件或真实浏览器验证。不同测试层应该覆盖不同失败模式，而不是把同一条断言搬来搬去。`]}),`
`,(0,n.jsx)(r.h2,{id:`mock-的边界`,children:`Mock 的边界`}),`
`,(0,n.jsx)(r.p,{children:`优先 mock 网络、时钟、第三方不稳定边界和无法控制的运行环境。不要把整条业务调用链全部替换成 mock：被测代码需要的协作关系也被删掉后，测试可能只证明桩返回了预期值，而没有验证真实的业务组合。`}),`
`,(0,n.jsxs)(i,{title:`测试内部 state 或实现调用次数`,children:[(0,n.jsx)(r.p,{children:`除非调用协议本身就是公共契约，否则测试内部 hook/state、私有函数或脆弱 DOM 层级会让安全重构变得困难。优先断言用户能看到/操作的结果。`}),(0,n.jsx)(r.p,{children:`例如同一个“保存资料”流程，如果 RTL 和 Playwright 都完整重复按钮文案、loading 细节、成功文案和每个中间状态的断言，任一文案调整都会让两层测试一起维护。可以让 RTL 覆盖局部交互与状态转换，再让 Playwright 保留真实浏览器中的关键路径和边界证据。`})]}),`
`,(0,n.jsx)(o,{title:`测试通过不等于产品正确`,children:(0,n.jsx)(r.p,{children:`自动化只能证明已编码的断言。可访问性、视觉回归、真实网络故障、浏览器差异仍需要相应工具与人工验收。TypeScript 也只能证明静态类型关系，不能替代运行时行为测试。`})}),`
`,(0,n.jsx)(m,{children:(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`从风险和用户行为设计测试，而不是从函数列表设计测试。`}),`
`,(0,n.jsx)(r.li,{children:`RTL 优先语义 query + user-event。`}),`
`,(0,n.jsx)(r.li,{children:`E2E 留给真实浏览器边界和关键路径。`}),`
`,(0,n.jsx)(r.li,{children:`各层避免重复，CI 证据要能定位失败责任。`}),`
`]})}),`
`,(0,n.jsx)(d,{items:[{label:`Testing Library: Guiding Principles`,href:`https://testing-library.com/docs/guiding-principles`},{label:`Vitest Guide`,href:`https://vitest.dev/guide/`},{label:`Playwright: Best Practices`,href:`https://playwright.dev/docs/best-practices`}]})]})}function i(t={}){let{wrapper:i}={...e(),...t.components};return i?(0,n.jsx)(i,{...t,children:(0,n.jsx)(r,{...t})}):r(t)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};