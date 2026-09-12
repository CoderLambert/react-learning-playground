var e=`# Event、Effect 与 Effect Event

<MentalModel title="先问：这段逻辑为什么发生？">
如果逻辑因为用户做了某个明确动作而发生，它通常属于 Event Handler；如果逻辑因为组件已经渲染、需要与某个外部系统保持同步而发生，它属于 Effect。Effect Event 用来把 Effect 中“需要读取最新 committed props/state、但这些值不代表需要重新同步”的非响应式部分拆出来。
</MentalModel>

## 三种职责不是三个“放代码的位置”

<Compare>
### Event Handler
由具体交互触发，例如点击“发送”、提交表单、选择文件。即使组件重新 render，只要用户没有再次触发事件，这段逻辑就不应自动重跑。

### Effect
由“当前渲染结果需要和外部系统同步”触发，例如连接聊天室、订阅浏览器 API、同步媒体播放器。依赖变化意味着同步关系需要重新建立。

### Effect Event
它是 Effect 逻辑的一部分，只能从 Effect 或其他 Effect Event 调用；内部可以读取最新 committed props/state，而这些读取不会自动成为外层 Effect 的重新同步条件。
</Compare>

<Experiment title="只改主题，再改连接目标">
中间 Demo 同时运行两个真实连接 Effect。先只切换 theme：左侧 Effect 把 \`roomId + theme\` 都作为依赖，因此会 cleanup 并重新 setup；右侧只让 \`roomId\` 决定连接生命周期，把通知里的 theme 读取放进 Effect Event，因此不会因为 theme 重连。再切换 roomId，观察两侧都重新 setup。
</Experiment>

<DemoReference action="记录两侧当前 setup 次数；只切换 theme，再切换 roomId" observe="比较同一次操作前后的真实 Effect setup 增量，而不是依赖初始绝对计数。" />

<Flow items={[
  "用户点击 / 输入 / 提交 → Event Handler",
  "组件呈现后必须与外部系统保持一致 → Effect",
  "Effect 内某段逻辑要读取最新值，但该值不代表同步条件 → Effect Event"
]} />

<Observation>
Effect 的依赖不是“我希望什么时候执行”的手工开关，而是 Effect 所读取并参与同步关系的响应式值。为了阻止 Effect 重跑而删除真实依赖，会让逻辑与声明不一致；相反，应先判断某段读取究竟属于同步条件，还是只属于 Effect 触发时发生的非响应式事件逻辑。
</Observation>

<AntiPattern title="为了少跑 Effect 而欺骗依赖数组">
不要通过遗漏依赖、关闭 lint 或把响应式值随意藏进 Effect Event 来伪造“只执行一次”。如果某个值确实决定外部同步目标，它就应该是依赖；只有“Effect 已经发生时需要读取最新值，但这个值本身不应触发重新同步”的逻辑才适合 Effect Event。
</AntiPattern>

<Boundary title="Effect Event 不是 useCallback，也不是通用事件系统">
Effect Event 只能从 Effect 或其他 Effect Event 调用，不应传给其他组件或 Hook，也不用于替代普通点击 handler。它的函数 identity 也不是稳定性保证，因此不要把它当作 memoization 工具。能直接在 render 中派生的数据不要放 Effect；能直接在事件中完成的业务动作也不要先写入 state 再用 Effect 间接触发。
</Boundary>

## 一个实用判断顺序

<Timeline steps={[
  "先判断这段逻辑是否真的需要外部同步；如果只是派生数据，留在 render",
  "若由明确用户动作触发，放 Event Handler",
  "若由组件呈现状态决定外部连接/订阅，使用 Effect，并完整声明真正的同步依赖",
  "若 Effect 的一小段逻辑需要最新 committed 值但该值不应触发重新同步，再抽成 Effect Event"
]} />

<Summary>
- Event 回答“用户做了什么”。
- Effect 回答“当前 UI 状态需要与哪个外部系统保持同步”。
- Effect Event 解决的是 Effect 内响应式同步条件与非响应式事件逻辑的边界。
- 先重构职责，再讨论依赖数组；不要用 Effect Event 隐藏真实依赖。
</Summary>

<FurtherReading items={[
  { label: "React: useEffectEvent", href: "https://react.dev/reference/react/useEffectEvent" },
  { label: "React: Separating Events from Effects", href: "https://react.dev/learn/separating-events-from-effects" },
  { label: "React: Removing Effect Dependencies", href: "https://react.dev/learn/removing-effect-dependencies" }
]} />
`;export{e as default};