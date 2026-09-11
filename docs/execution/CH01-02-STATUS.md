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
- [x] 01-07 Prop Drilling 与 Composition / Context 边界复查
  - 更新：`src/demos/PropDrillingDemo.jsx`
  - 修正：不再把 prop drilling 一概定义为反模式，不再把 Composition 表述为无条件“官方首选”
  - 心智模型：先判断 State ownership / 消费范围 / 组件职责，再选择显式 Props、Composition 或 Context
  - 可观察实验：修改同一份 `user`，对比三种传递路径在中间组件接口上的差异
  - 正确边界：Props 保持显式数据流；中间层本质为布局容器时可考虑 children/slot；多个远距离消费者需要同一信息时再考虑 Context
  - 反模式：仅凭“传了两三层”机械引入 Context；仅凭层数判断架构方案
  - 内容依据：React 官方 `Passing Data Deeply with Context` 的 “Before you use context” 与 useContext 文档
  - Demo 注册：已有且已复核
  - CodeViewer `?raw`：已有 `PropDrillingDemo.jsx?raw` 且已复核

Chapter 01 内容：**COMPLETE**。

Chapter 01 Gate：**BLOCKED / PENDING**。按照任务规则，本章必须在可执行工作区真实运行 `npm run lint`、`npm run build`、`npm run preview` smoke test，全部通过后才能标记章节完成、提交 chapter completion commit，并进入 Chapter 02。

### Chapter 02 — 事件、State 与渲染模型

- [ ] 02-01 Event Handler 与事件传播
- [ ] 02-02 useState 基础与 State 属于组件位置
- [ ] 02-03 State as Snapshot
- [ ] 02-04 Update Queue + Batching + Functional Updater
- [ ] 02-05 Object / Array State 不可变更新
- [ ] 02-06 Trigger → Render → Commit

Chapter 02 Gate：**未执行**。

## 本轮验证记录

- 远端分支 HEAD 检查：PASS（本轮开始时 `fd2937cc4cf4ad35fa2bae702c4c89befd4486d4`）
- `PropDrillingDemo.jsx` 边界修正：PASS（GitHub 写入）
- Demo 注册：PASS（静态检查，`src/demos/index.js` 已注册 `PropDrillingDemo`）
- `?raw` CodeViewer 注册：PASS（静态检查，`PropDrillingDemo.jsx?raw` 已注册）
- React 官方当前文档校准：PASS
- `npm run lint`：PENDING（无可执行仓库工作树）
- `npm run build`：PENDING（无可执行仓库工作树）
- `npm run preview` smoke test：PENDING（无可执行仓库工作树）

## 运行环境说明

当前自动执行环境仍未发现可直接使用的 `react-learning-playground` 本地工作树。本轮通过 GitHub 仓库连接能力完成了 01-07 的代码修正与静态注册核对，但 GitHub contents API 不能替代真实 Node/Vite 工作区执行 lint/build/preview。

因此严格停在 Chapter 01 Gate：不得把 Chapter 01 标记为质量门禁 PASS，不得进入 Chapter 02，也不得创建“Chapter 01 complete”提交或后续 PR 完成声明。

## 下一步

一旦存在可执行本地工作区，立即在 `learn/ch01-02-ui-render` 上运行（依赖缺失时先 `npm ci`）：

```bash
npm run lint
npm run build
npm run preview
```

完成聚焦模式、连续阅读、搜索、CodeViewer、交互、Console 与窄屏基础 smoke test；全部 PASS 后再标记 Chapter 01 完成并进入 02-01。
