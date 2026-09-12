var e=`# Event Handler 与事件传播

事件处理器描述的是一次具体交互。React 会把事件对象交给 handler；同一次事件还可能沿 React tree 传播，并触发浏览器默认行为。

<MentalModel title="传播与默认行为是两个独立维度">
\`stopPropagation()\` 控制事件是否继续到后续 handler；\`preventDefault()\` 控制浏览器是否执行该事件对应的默认行为。调用其中一个不会自动完成另一个。
</MentalModel>

## 先预测，再做实验

<Experiment title="四种组合">
在中间 Demo 中依次测试：两个开关都关闭、只开 \`stopPropagation\`、只开 \`preventDefault\`、两个都打开。每次点击提交按钮前，先预测 parent capture、target、parent bubble 和 form submit 哪些会出现。
</Experiment>

<DemoReference action="切换 stopPropagation / preventDefault 后点击提交按钮" observe="比较 capture → target → bubble 日志，以及 form submit 默认行为是否仍被触发。" />

正常情况下，同一次 click 会先让 capture handler 从外向内观察，再执行 target handler，随后进入 bubble。若 target 调用 \`stopPropagation()\`，已经发生的 capture 不会被撤销，但后续 parent bubble 不再执行。若只调用 \`preventDefault()\`，bubble 仍继续，只是按钮作为 submit button 的默认提交行为被取消。

React 官方还指出一个常见例外：\`onScroll\` 不像大多数事件那样向上冒泡，因此不要把“所有事件都会 bubble”当作规则。

<Boundary title="传函数，而不是在 render 时调用">
\`onClick={handleClick}\` 把 handler 交给 React；\`onClick={handleClick()}\` 会在 render 期间立即调用。需要参数时可以包装为 \`onClick={() => handleSelect(id)}\`。
</Boundary>

## 项目里怎么判断

- 需要父层统一观察一组交互：考虑 bubble；确实需要在目标前观察时再使用 capture。
- 只是不希望父 handler 收到这次事件：\`stopPropagation()\`。
- 只是不希望链接跳转、表单提交等浏览器默认行为发生：\`preventDefault()\`。
- “这次点击应该执行一次业务命令”属于 Event vs Effect 的职责判断，放到专门的 Event vs Effect 章节理解，不在事件传播模型里混讲。

<Summary>
- handler 是由交互触发的一次因果逻辑。
- capture / target / bubble 描述传播阶段。
- stopPropagation 与 preventDefault 解决不同问题。
- 不要把“默认行为”和“事件传播”混成同一条开关。
</Summary>

<FurtherReading items={[{ label: "React: Responding to Events", href: "https://react.dev/learn/responding-to-events" }, { label: "MDN: Event bubbling", href: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling" }]} />`;export{e as default};