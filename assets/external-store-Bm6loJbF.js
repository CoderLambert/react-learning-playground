var e=`# useSyncExternalStore 外部订阅

<MentalModel title="React 需要一个一致的外部 Store 快照协议">
\`useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)\` 让 React 安全读取 React 之外的数据源。\`subscribe\` 告诉 React 何时可能变化；\`getSnapshot\` 返回当前快照，且在 Store 未变化时必须保持 \`Object.is\` 相等。
</MentalModel>

<Experiment title="观察 snapshot 更新与真实 subscribe / unsubscribe">
在中间 Demo 修改外部 Store，观察两个 Reader 如何读取同一 snapshot version；再卸载/重新挂载 Reader B，查看独立生命周期面板记录的 subscribe / unsubscribe 和最终 listener count。开发 Strict Mode 可能出现额外的订阅 setup/cleanup 验证周期，因此不要把“只订阅一次”当成契约。
</Experiment>
<DemoReference action="更新 Store，并卸载/挂载 Reader B" observe="Store 通知后 Reader 获得新 snapshot；卸载 Reader B 后 counterStore 的真实订阅数下降，并记录 unsubscribe。" />

<Timeline steps={["render 期间 React 调用 getSnapshot 读取当前视图","React 建立 subscribe，并要求返回 cleanup","外部 Store 变化并调用 listener","React 再次读取 snapshot 并用 Object.is 比较","snapshot 变化则更新；订阅生命周期结束时调用 unsubscribe"]} />

<AntiPattern title="每次 getSnapshot 都返回新对象">
如果底层数据没变却每次创建新对象，React 会认为快照持续变化，导致无意义更新甚至循环。可返回不可变快照，或在 Store 层缓存派生结果。
</AntiPattern>

<Boundary title="不是所有全局状态都需要外部 Store">
React 内部应用状态优先考虑 state/reducer/context。\`useSyncExternalStore\` 适合浏览器 API、自定义 Store、状态库适配等 React 外部订阅源；成熟状态库通常已封装该协议。教学 instrumentation 也不应混入业务 snapshot，否则观察订阅本身就会制造新的业务版本。
</Boundary>

<Observation>
服务端渲染场景可提供 \`getServerSnapshot\`，其服务端值与 hydration 首次客户端值必须协调，否则会产生一致性问题。React 官方还要求 store 未变化期间重复调用 \`getSnapshot\` 返回同一个 snapshot identity；不要通过在 \`getSnapshot\` 内写日志 State 等副作用来“统计调用次数”。
</Observation>

<Summary>
- \`subscribe\` 负责通知，\`getSnapshot\` 负责一致读取。
- 未变化的 snapshot 必须保持 identity 稳定。
- cleanup 是订阅生命周期的一部分。
- Strict Mode 开发验证可能产生额外 setup/cleanup，不改变最终 cleanup 契约。
- 优先使用状态库提供的官方 React binding，而不是重复造适配层。
</Summary>

<FurtherReading items={[{label:"React: useSyncExternalStore",href:"https://react.dev/reference/react/useSyncExternalStore"}]} />`;export{e as default};