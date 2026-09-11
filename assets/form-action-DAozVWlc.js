var e=`# React 19 form Action：把提交建模为 Action

当函数传给 \`<form action>\` 或提交按钮的 \`formAction\` 时，React 把本次 \`FormData\` 传给该函数，并按 Action/Transition 模型处理异步提交。

<MentalModel title="Action 是提交事务，不是 onSubmit 的语法糖">传统 \`onSubmit\` 仍然有效；函数 action 提供的是 React 19 的 Action 提交模型。按钮级 \`formAction\` 还能覆盖 form 默认 action，用于“发布 / 保存草稿”等多意图提交。</MentalModel>

<Timeline items={["submit", "浏览器形成 FormData", "React 调用函数 Action", "Action pending/Transition", "成功提交", "非受控字段 reset"]} />

<Experiment title="发布与保存草稿">
运行中间 Demo，用同一表单分别点击默认提交按钮和带 \`formAction\` 的按钮。观察两条 Action 收到相同表单快照，但执行不同业务意图。
</Experiment>

<Observation>函数 Action 成功后，React 会重置表单中的非受控字段；受控字段仍由你的 State 决定，因此 reset 策略必须与字段所有权一致。</Observation>

<AntiPattern title="把 action 当成自动 API 层">Action 组织提交状态与过渡，但业务校验、鉴权、错误模型和服务器一致性仍需应用自己负责。</AntiPattern>

<Boundary>如果项目并不需要 React Action 模型，传统 \`onSubmit + preventDefault\` 仍是合法方案。选择应由状态建模和框架边界决定。</Boundary>

<Summary items={["函数 action 接收 FormData", "按钮 formAction 可覆盖默认提交意图", "Action 与 Transition 模型协作", "不要把它误解为 onSubmit 语法糖"]} />

<FurtherReading links={[{label:"React: form",href:"https://react.dev/reference/react-dom/components/form"},{label:"React 19: Actions",href:"https://react.dev/blog/2024/12/05/react-19"}]} />`;export{e as default};