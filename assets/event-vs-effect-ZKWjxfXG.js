var e=`# Event vs Effect：按“为什么执行”划分职责

Event Handler 因特定交互发生；Effect 因组件需要与外部系统保持同步而发生。二者都能执行副作用，但因果模型不同。

<MentalModel title="Event 是一次因果；Effect 是持续同步">“用户点击购买”属于事件；“只要 roomId 为 X，就保持连接 X”属于 Effect。判断依据不是代码有没有副作用，而是它为什么必须执行。</MentalModel>

<Flow items={["用户动作 → Event Handler → 一次业务命令", "render/commit → Effect → 外部系统与当前 UI 状态同步"]} />

<Experiment title="观察重复触发风险">
在中间 Demo 对比直接在点击 handler 发送动作，与 setState 后让 Effect 根据 State 发送动作。改变其他依赖或重新挂载，观察后者为什么可能重复执行业务命令。
</Experiment>

<Observation>Effect 可以因为依赖变化、重新挂载或开发环境检查而重新同步；因此不能把“只能发生一次的用户动作”依赖于 Effect 的执行时机。</Observation>

<AntiPattern title="State 充当事件总线">为了让 Effect 知道按钮被点过而增加 \`submitted\`、\`shouldNotify\` 等瞬时 State，通常是在把清晰事件因果改造成间接状态机。</AntiPattern>

<Boundary>有些事件会改变 State，而新的 State 又要求外部系统同步；这时 handler 更新 State，Effect 负责同步，各自保持职责清晰。</Boundary>

<Summary items={["Event 回答发生了什么", "Effect 回答当前状态需要同步什么", "一次性业务命令优先放 handler", "不要用 State + Effect 模拟事件"]} />

<FurtherReading links={[{label:"React: Separating Events from Effects",href:"https://react.dev/learn/separating-events-from-effects"}]} />`;export{e as default};