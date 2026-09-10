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
- [ ] 01-05 Conditional Rendering
- [ ] 01-06 Rendering Lists + key 身份模型
- [ ] 01-07 Prop Drilling 与 Composition / Context 边界复查

Chapter 01 Gate：**未执行**。本章尚未完成，按任务规则不得提前标记 lint/build/preview 通过。

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
- Demo 注册：PASS（静态检查）
- `?raw` CodeViewer 注册：PASS（静态检查）
- `npm run lint`：PENDING（Chapter 01 完成后执行）
- `npm run build`：PENDING（Chapter 01 完成后执行）
- `npm run preview` smoke test：PENDING（Chapter 01 完成后执行）

## 运行环境说明

当前自动执行环境无法直接解析 `github.com` 主机，因此不能通过 `git clone` 获取工作树执行本地 npm 命令。章节 Gate 到达时必须优先尝试可用的工作树 / CI；若仍不可用，不得把章节标记为 DONE，也不得伪造验证结果。

## 下一步

继续 `01-05 Conditional Rendering`，使用 loading / empty / error / success 四态 UI 做最小交互实验，并保持现有 Demo 视觉系统。
