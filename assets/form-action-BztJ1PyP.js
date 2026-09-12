var e=`# React 19 form Action：把提交建模为 Action

当函数传给 \`<form action>\` 或提交按钮的 \`formAction\` 时，React 把本次 \`FormData\` 传给该函数，并按 Action/Transition 模型处理异步提交。

<MentalModel title="Action 是提交事务，不是 onSubmit 的语法糖">传统 \`onSubmit\` 仍然有效；函数 action 提供的是 React 19 的 Action 提交模型。按钮级 \`formAction\` 还能覆盖 form 默认 action，用于“发布 / 保存草稿”等多意图提交。它已经把“哪个按钮触发哪个 Action”表达在提交结构中，通常不需要额外的 State 保存“刚才点击的是哪个按钮”。</MentalModel>

<Timeline steps={["submit", "浏览器形成 FormData", "React 调用函数 Action", "Action pending/Transition", "Action 成功完成", "非受控字段 reset"]} />

<Experiment title="发布与保存草稿">
运行中间 Demo，用同一表单分别点击默认提交按钮和带 \`formAction\` 的按钮，观察日志中的 \`publish\` / \`draft\` 路径与完成状态。再对照 Source：两条函数都接收本次 \`FormData\`，但 Demo 只展示它们各自读取的字段，并没有证明服务器已完成业务处理。
</Experiment>

<DemoReference action="分别点击默认提交和 formAction 按钮" observe="比较日志中的 \`publish\` / \`draft\` 路径、各自读取的字段与 Action 完成后的表单行为；不要把本地 Demo 的完成日志当成服务器业务成功证据。" />

<Observation>函数 Action 成功完成后，React 会重置表单中的非受控字段；受控字段仍由你的 State 决定，因此 reset 策略必须与字段所有权一致。本 Demo 的“完成”只表示本地函数 Action 的异步工作完成；React Action 完成不等价于服务器业务一定成功，业务结果、校验、鉴权与一致性仍由应用和服务端协议负责。</Observation>

<AntiPattern title="把 action 当成自动 API 层">Action 组织提交状态与过渡，但业务校验、鉴权、错误模型和服务器一致性仍需应用自己负责。</AntiPattern>

<Boundary>如果项目并不需要 React Action 模型，传统 \`onSubmit + preventDefault\` 仍是合法方案。选择应由状态建模和框架边界决定。</Boundary>

<Summary>
- 函数 action 接收 FormData。
- 按钮 formAction 可覆盖默认提交意图。
- Action 与 Transition 模型协作。
- 不要把它误解为 onSubmit 语法糖。
</Summary>

<FurtherReading items={[{label:"React: form",href:"https://react.dev/reference/react-dom/components/form"},{label:"React 19: Actions",href:"https://react.dev/blog/2024/12/05/react-19"}]} />
`;export{e as default};