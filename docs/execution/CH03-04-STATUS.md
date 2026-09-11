# Chapter 03-04 执行状态

工作分支：`learn/ch03-04-state-effects`

## 当前状态

### Chapter 03 — State 建模与状态架构

- [x] 03-01 State DRY / Single Source of Truth — 复用并校对 `StateDryDemo.jsx`
- [x] 03-02 Choosing State Structure — 已补充到 `StateDryDemo.jsx`
- [x] 03-03 Controlled / Uncontrolled Component — 新增 `ControlledUncontrolledDemo.jsx`
- [x] 03-04 Lifting State Up — 现有 `LiftingStateUpDemo.jsx`
- [x] 03-05 Preserving / Resetting State + key — 新增 `PreservingResettingStateDemo.jsx`
- [x] 03-06 useReducer — 现有 `StateReducerDemo.jsx`
- [x] 03-07 Context 更新传播模型 — 新增 `ContextPropagationDemo.jsx`
- [x] 03-08 Reducer + Context — 现有 `UseReduceWithContextDemo.jsx`；导航描述已校正为“缩小只消费 dispatch 节点的更新范围”

### Chapter 04 — Ref、Effect 与 Escape Hatches

- [x] 04-01 useRef — 现有 `UseRefDemo.jsx`
- [x] 04-02 useEffect 正确心智 + Cleanup — 现有 `UseEffectCorrectUsageDemo.jsx`
- [x] 04-03 You Might Not Need an Effect — 现有 `NotNeedEffectDemo.jsx`
- [x] 04-04 Effect Lifecycle / Dependencies — 现有 `LifecycleOfReactiveEffectsDemo.jsx`
- [ ] 04-05 Event vs Effect
- [ ] 04-06 useEffectEvent
- [ ] 04-07 Custom Hooks
- [ ] 04-08 useLayoutEffect / useImperativeHandle / ref as prop

## 已完成内容

### 03-02 Choosing State Structure

依据 React 官方 `Choosing the State Structure` 五条原则补强 `StateDryDemo.jsx`：related / contradictory / redundant / duplicate / deeply nested state。保留派生数据、实体 ID 与 normalization 边界，避免为了教学把所有 State 机械扁平化。

### 03-03 Controlled / Uncontrolled Component

新增 `ControlledUncontrolledDemo.jsx`，以 Tabs 组件 API 解释 State ownership：

- controlled：`value + onChange`，父组件持有唯一事实来源；
- uncontrolled：`defaultValue` 仅负责初始化，后续由组件内部 State 持有；
- URL 同步、跨组件协调等更适合 controlled；纯局部 UI 可用 uncontrolled；
- 一次挂载期间不应随意切换 controlled / uncontrolled ownership 模式。

### 03-05 Preserving / Resetting State + key

新增 `PreservingResettingStateDemo.jsx`，使用聊天草稿场景直接观察组件身份：

- 相同父级位置 + 相同 `Chat` 类型且没有变化的 key：切换 contact prop 后，`draft` State 默认保留；
- `key={contact.id}` 改变时：React 将其视为不同组件身份，旧子树卸载，新子树挂载，内部 `draft` reset；
- 强调 key 不只是列表 warning 工具，也不应使用随机 key 来“强制刷新”，否则会制造无意义 remount 与 State 丢失。

该结论依据 React 官方 `Preserving and Resetting State`：State 与 render tree 中的位置关联，同位置同类型默认保留；改变 key 可以显式重置子树。

### 03-07 Context 更新传播模型

新增 `ContextPropagationDemo.jsx`：

- `useContext` 不仅取值，也建立对最近 Provider value 的订阅；
- Provider value 改变后，读取该 Context 的后代获得最新值并重新渲染；
- React 使用 `Object.is` 比较新旧 Context value；
- `memo` 不会阻止 Context consumer 收到新的 Context value；
- 不读取该 Context 的 memoized 节点可以避开与 Context 无关的父级更新；
- 教学 render 计数显式记录实验预期路径，并明确声明不能代替 React DevTools Profiler。

该结论依据 React 官方 `useContext` Reference。

## Demo / CodeViewer 注册

以下新增 Demo 已注册到 `src/demos/index.js`，并包含 `?raw` 源码：

- `PreservingResettingStateDemo.jsx`
- `ContextPropagationDemo.jsx`

## Chapter 03 Gate

Chapter 03 内容任务已覆盖，但**尚未标记章节完成**，因为质量门禁必须得到真实执行结果：

- `npm run lint`: PENDING
- `npm run build`: PENDING
- `npm run preview`: PENDING
- Console / focus mode / continuous mode / mobile smoke: PENDING

当前 GitHub connector 可持续安全写入分支文件，但本执行环境没有可用仓库工作树来运行 npm 脚本。此前直接 `git clone` 也因执行环境 DNS 无法解析 `github.com` 失败，因此不能伪造 Gate 结果。在获得可执行工作树或可替代 CI 证据前，Chapter 03 保持“内容完成 / Gate 未完成”。

## 下一任务

若后续运行环境可以执行仓库命令，优先完成 Chapter 03 Gate；Gate 通过后再进入 Chapter 04。

若仍无法执行 Gate，则不跨越质量门禁修改 Chapter 04，以遵守“每章通过 lint + build + preview 才进入下一章”的规则。
