# Chapter 01-02 执行状态

> 分支：`learn/ch01-02-ui-render`
>
> 范围：Chapter 01「UI 与组件模型」、Chapter 02「事件、State 与渲染模型」。

## 当前状态

### Chapter 01 — UI 与组件模型

- [x] 01-01 Component + JSX + Pure Render
  - 新增：`src/demos/ComponentJsxPureRenderDemo.jsx`
  - 已注册：`src/demos/index.js`
  - CodeViewer：已通过 `?raw` 注册 Demo 源码
  - 内容依据：React 官方 `Your First Component`、`Describing the UI`、`Keeping Components Pure`
  - 实验：组件树 / JSX / Fragment；相同输入重复计算下 Pure vs Impure 结果对比
  - 工程边界：组件拆分职责；render 期间禁止副作用；事件处理器与 Effect 的后续职责边界
- [x] 01-02 Props 基础与只读数据流（仓库已有）
- [x] 01-03 Children 默认插槽与 Composition（仓库已有）
- [x] 01-04 Named Slots / 组件组合 API（仓库已有）
- [x] 01-05 Conditional Rendering
  - 新增：`src/demos/ConditionalRenderingDemo.jsx`
  - 覆盖：`if` / early return、ternary、`&&`、条件不成立时不渲染对应 JSX
  - 实验：loading / empty / error / success 四态业务 UI
  - 工程边界：大块互斥状态避免嵌套三元；可派生 UI 状态不重复存入 State
  - 内容依据：React 官方 `Conditional Rendering`
- [x] 01-06 Rendering Lists + key 身份模型
  - 新增：`src/demos/RenderingListsKeyDemo.jsx`
  - 覆盖：`map()`、stable key、index key 风险、render 时动态生成 key 的风险
  - 实验：可编辑任务列表先输入行内 State，再 reorder/remove，对比 index key 与 stable id 的组件身份匹配
  - 工程边界：支持排序、插入、删除或行内局部 State 的真实列表必须使用稳定业务身份
  - 内容依据：React 官方 `Rendering Lists`
- [ ] 01-07 Prop Drilling 与 Composition / Context 边界复查
  - 已发现：当前 `PropDrillingDemo.jsx` 将 prop drilling 直接定义为“反模式”，并写成“官方首选推荐：组件组合”，表述过度绝对化；下一轮需改成基于深度、复用性、数据所有权和消费范围的权衡说明。

Chapter 01 Gate：**未执行**。本章尚有 `01-07` 复查未完成，按任务规则不得提前标记 lint/build/preview 通过。

### Chapter 02 — 事件、State 与渲染模型

- [ ] 02-01 Event Handler 与事件传播
- [ ] 02-02 useState 基础与 State 属于组件位置
- [ ] 02-03 State as Snapshot
- [ ] 02-04 Update Queue + Batching + Functional Updater
- [ ] 02-05 Object / Array State 不可变更新
- [ ] 02-06 Trigger → Render → Commit

Chapter 02 Gate：**未执行**。

## 本轮验证记录

- GitHub 分支修改：PASS
- `ConditionalRenderingDemo.jsx` 创建并注册：PASS（静态检查）
- `RenderingListsKeyDemo.jsx` 创建并注册：PASS（静态检查）
- `?raw` CodeViewer 注册：PASS（静态检查）
- `npm run lint`：PENDING（Chapter 01 完成后执行）
- `npm run build`：PENDING（Chapter 01 完成后执行）
- `npm run preview` smoke test：PENDING（Chapter 01 完成后执行）

## 运行环境说明

当前自动执行环境没有可直接使用的仓库本地工作树，因此本轮只能完成 GitHub 侧静态写入与注册核对。章节 Gate 到达时必须优先尝试可用的工作树 / CI；若仍不可用，不得把章节标记为 DONE，也不得伪造验证结果。

## 下一步

完成 `01-07 Prop Drilling 与 Composition / Context 边界复查`，修正过度绝对化表述；随后立即执行 Chapter 01 的 lint/build/preview 质量门禁。只有 Gate PASS 后才进入 Chapter 02。
