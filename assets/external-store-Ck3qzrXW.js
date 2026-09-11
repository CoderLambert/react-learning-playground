var e=`# useSyncExternalStore 外部订阅

<MentalModel title="React 需要一个一致的外部 Store 快照协议">
\`useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)\` 让 React 安全读取 React 之外的数据源。\`subscribe\` 告诉 React 何时可能变化；\`getSnapshot\` 返回当前快照，且在 Store 未变化时必须保持 \`Object.is\` 相等。
</MentalModel>

<Experiment title="观察 subscribe / snapshot / unsubscribe">
在中间 Demo 修改外部 Store，观察订阅通知、\`getSnapshot\` 调用和组件更新；再切换组件挂载状态观察 cleanup。
</Experiment>
<DemoReference action="更新 Store 并挂载/卸载订阅组件" observe="Store 变化通知触发快照重读；卸载后订阅必须释放。" />

<Timeline steps={["render 调用 getSnapshot 读取一致视图","commit 后建立 subscribe","外部 Store 变化并调用 listener","React 再次读取 snapshot 并比较 identity","snapshot 变化则更新；卸载时 unsubscribe"]} />

<AntiPattern title="每次 getSnapshot 都返回新对象">
如果底层数据没变却每次创建新对象，React 会认为快照持续变化，导致无意义更新甚至循环。可返回不可变快照，或在 Store 层缓存派生结果。
</AntiPattern>

<Boundary title="不是所有全局状态都需要外部 Store">
React 内部应用状态优先考虑 state/reducer/context。\`useSyncExternalStore\` 适合浏览器 API、自定义 Store、状态库适配等 React 外部订阅源；成熟状态库通常已封装该协议。
</Boundary>

<Observation>
服务端渲染场景可提供 \`getServerSnapshot\`，其服务端值与 hydration 首次客户端值必须协调，否则会产生一致性问题。
</Observation>

<Summary>
- \`subscribe\` 负责通知，\`getSnapshot\` 负责一致读取。
- 未变化的 snapshot 必须保持 identity 稳定。
- cleanup 是订阅生命周期的一部分。
- 优先使用状态库提供的官方 React binding，而不是重复造适配层。
</Summary>

<FurtherReading items={[{label:"React: useSyncExternalStore",href:"https://react.dev/reference/react/useSyncExternalStore"}]} />`;export{e as default};