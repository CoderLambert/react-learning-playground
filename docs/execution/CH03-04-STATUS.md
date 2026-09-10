# Chapter 03-04 执行状态

工作分支：`learn/ch03-04-state-effects`

## 当前状态

### Chapter 03 — State 建模与状态架构

- [x] 03-01 State DRY / Single Source of Truth — 复用并校对 `StateDryDemo.jsx`
- [x] 03-02 Choosing State Structure — 已补充到 `StateDryDemo.jsx`
- [x] 03-03 Controlled / Uncontrolled Component — 新增 `ControlledUncontrolledDemo.jsx`
- [x] 03-04 Lifting State Up — 现有 `LiftingStateUpDemo.jsx`
- [ ] 03-05 Preserving / Resetting State + key
- [x] 03-06 useReducer — 现有 `StateReducerDemo.jsx`
- [ ] 03-07 Context 更新传播模型 — 待复查/补充
- [x] 03-08 Reducer + Context — 现有 `UseReduceWithContextDemo.jsx`，后续需要校正“拆分 Context 可彻底规避无效重新渲染”的过度表述

### Chapter 04 — Ref、Effect 与 Escape Hatches

- [x] 04-01 useRef — 现有 `UseRefDemo.jsx`
- [x] 04-02 useEffect 正确心智 + Cleanup — 现有 `UseEffectCorrectUsageDemo.jsx`
- [x] 04-03 You Might Not Need an Effect — 现有 `NotNeedEffectDemo.jsx`
- [x] 04-04 Effect Lifecycle / Dependencies — 现有 `LifecycleOfReactiveEffectsDemo.jsx`
- [ ] 04-05 Event vs Effect
- [ ] 04-06 useEffectEvent
- [ ] 04-07 Custom Hooks
- [ ] 04-08 useLayoutEffect / useImperativeHandle / ref as prop

## 本轮完成

### 03-02 Choosing State Structure

依据 React 官方 `Choosing the State Structure` 的五条原则补强现有 `StateDryDemo.jsx`：

1. Group related state
2. Avoid contradictions in state
3. Avoid redundant state
4. Avoid duplication in state
5. Avoid deeply nested state

实现内容：

- 保留 `fullName` 渲染期派生实验，强调 redundant state 不需要 `Effect + setState` 同步。
- 新增 `status = typing | sending | sent` 实验，对比多个 boolean 可能构造出“不可能状态”。
- 保留并强化购物车 `selectedId` 方案，展示“保存实体 ID 而不是复制整条对象”的单一数据源模型。
- 新增扁平化树数据实验，使用 `id -> entity` 映射 + `childIds`，演示只修改直接父关系即可删除节点关系。
- 增加项目边界：不是要求所有 State 一律扁平化，而是在嵌套导致更新困难、重复数据和同步风险时再 normalization。

### 03-03 Controlled / Uncontrolled Component

新增 `src/demos/ControlledUncontrolledDemo.jsx`，以可复用 `Tabs` 组件而不是只用原生 input 解释 State ownership：

- 受控模式：`value + onChange`，父组件持有唯一事实来源。
- 非受控模式：`defaultValue` 仅提供初始值，组件内部 `internalValue` 持有后续状态。
- 可视化 `Parent state -> value -> Tabs -> onChange -> Parent setter -> next render` 数据流。
- 增加真实项目选择边界：URL 同步、跨组件协调更适合 controlled；纯局部 UI 状态可以 uncontrolled。
- 明确一次挂载期间不应随意在 controlled / uncontrolled 两种所有权模式之间切换。
- 已注册到 `src/demos/index.js`，并注册 `ControlledUncontrolledDemo.jsx?raw` 供 CodeViewer 查看。

同时校正了 `Reducer + Context` 在 `src/demos/index.js` 中“彻底规避无效重新渲染”的过度描述，改为更准确的“缩小只消费 dispatch 节点的更新范围”。

## 官方依据

- React `Choosing the State Structure`
- React `Sharing State Between Components`
- React `Preserving and Resetting State`（下一任务）

## 验证记录

当前 Chapter 03 尚未完成，因此章节 Gate 尚未执行。

- `npm run lint`: PENDING（Chapter 03 Gate）
- `npm run build`: PENDING（Chapter 03 Gate）
- `npm run preview`: PENDING（Chapter 03 Gate）
- Console / focus mode / continuous mode / mobile smoke: PENDING（Chapter 03 Gate）

尝试在当前执行环境通过 `git clone` 获取远端分支用于本地编译验证，但环境无法解析 `github.com`，因此本轮不能伪造本地 build 结果。新增文件已做静态代码审查；最终语法、ESLint、Vite 编译和运行时验证仍必须在 Chapter 03 Gate 实际执行并记录。

## 下一任务

`03-05 Preserving / Resetting State + key`

目标：将 React “State 与 render tree 中的位置关联”可视化。建议使用聊天草稿场景：

- same position + same component type -> State preserved
- 切换联系人但组件仍位于同一位置 -> 草稿可能继续保留
- 使用不同 `key` 标识联系人 -> React 视为不同组件身份并 reset State
- 解释 `key` 不只是列表 warning，而是可以参与 State identity
