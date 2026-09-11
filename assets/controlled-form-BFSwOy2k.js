var e=`# Controlled Form：让 React State 成为字段事实来源

受控表单把 \`value\`/\`checked\` 交给 React State，并通过 \`onChange\` 把用户输入写回 State，因此界面值由 React 数据流决定。

<MentalModel title="value + onChange 是一个闭环">浏览器产生输入事件 → handler 更新 State → React render 新 value → DOM 显示新值。字段本身不是第二份事实来源。</MentalModel>

<Flow items={["input event", "onChange", "setState", "render 派生校验", "commit value/checked", "submit 读取当前 State 快照"]} />

<Experiment title="实时校验与 reset">
在中间 Demo 修改 input、textarea、select、checkbox 和 radio，观察派生 validation 如何立即更新；提交后查看快照，再执行 reset，确认所有字段由同一 State 模型恢复。
</Experiment>

<Observation>实时联动、条件禁用、即时校验和跨字段计算是 controlled form 的优势；代价是每次输入都会进入 React 更新路径。</Observation>

<AntiPattern title="重复保存可派生校验">不要把 \`isValid\`、\`fullName\` 等可从字段 State 计算的值再存一份 State 并用 Effect 同步。</AntiPattern>

<Boundary>不需要实时 React 协调的简单表单可以让 DOM 持有值，在提交时用 FormData 读取；controlled 不是所有表单的唯一正确答案。</Boundary>

<Summary items={["State 是受控字段事实来源", "onChange 闭合数据流", "校验优先派生计算", "按交互需求选择 controlled 程度"]} />

<FurtherReading links={[{label:"React: input",href:"https://react.dev/reference/react-dom/components/input"},{label:"React: select",href:"https://react.dev/reference/react-dom/components/select"},{label:"React: textarea",href:"https://react.dev/reference/react-dom/components/textarea"}]} />`;export{e as default};