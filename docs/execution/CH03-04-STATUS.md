# Chapter 03-04 执行状态

工作分支：`learn/ch03-04-state-effects`

## 当前状态

### Chapter 03 — State 建模与状态架构

- [x] 03-01 State DRY / Single Source of Truth — 复用并校对 `StateDryDemo.jsx`
- [x] 03-02 Choosing State Structure — 已补充到 `StateDryDemo.jsx`
- [ ] 03-03 Controlled / Uncontrolled Component
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

依据 React 官方 `Choosing the State Structure` 的五条原则补强现有 State Demo：

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

关键源码：`src/demos/StateDryDemo.jsx`

## 验证记录

当前 Chapter 03 尚未完成，因此章节 Gate 尚未执行。

- `npm run lint`: PENDING（Chapter 03 Gate）
- `npm run build`: PENDING（Chapter 03 Gate）
- `npm run preview`: PENDING（Chapter 03 Gate）
- Console / focus mode / continuous mode / mobile smoke: PENDING（Chapter 03 Gate）

本轮通过代码审查确认新增 JSX 结构、State 更新和递归渲染逻辑语义完整；最终语法、Lint、Vite 编译与运行时结果仍以 Chapter 03 Gate 的实际命令结果为准，不能提前标记 PASS。

## 下一任务

`03-03 Controlled / Uncontrolled Component`

目标：不要只讲原生 `<input>`，重点讲可复用组件 API 的 ownership：

```jsx
<Tabs value={active} onChange={setActive} />
<Tabs defaultValue="home" />
```

实验需要清晰展示：受控模式由父组件持有唯一事实来源；非受控模式由组件内部 State 持有状态；同一个组件 API 如何支持两种模式，以及为什么运行期间不应随意在 controlled / uncontrolled 之间切换。
