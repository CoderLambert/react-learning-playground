# Chapter 07-09 Execution Status

Branch: `learn/ch07-09-performance-data`

## Current status

### Chapter 07 — 性能模型与 React Compiler

- [x] 07-01 Re-render ≠ DOM Update
  - 新增 `src/demos/RenderVsDomUpdateDemo.jsx`
  - 使用 `MutationObserver` 只观察目标 DOM 节点，把组件树重新 render 与真实 DOM mutation 分开观察。
  - 强调 `Trigger → Render → Commit`，以及“看到 re-render 不等于立刻需要 memo”。
  - 已注册到 `performance` 分类和 CodeViewer `?raw` 源码。
- [x] 07-02 Reference Equality
  - 新增 `src/demos/ReferenceEqualityDemo.jsx`
  - 用 `Object.is` 对比组件内对象、数组、函数与模块级稳定引用跨 render 的 identity。
  - 明确新引用本身不是 Bug；只有当 identity 参与 memo props、Hook dependency、缓存或订阅协议时才重要。
  - 已注册到 `performance` 分类和 CodeViewer `?raw` 源码。
- [ ] 07-03 React.memo
- [ ] 07-04 useMemo
- [ ] 07-05 useCallback
- [ ] 07-06 Profiler
- [ ] 07-07 React Compiler

### Chapter 08 — 外部 Store 与第三方系统

- [ ] 未开始

### Chapter 09 — Server State 与请求架构

- [ ] 未开始

## Official-source review

本轮实现依据 React 官方当前文档校准：

- `Render and Commit`: render 阶段调用组件计算 UI；re-render 时 React 在 commit 阶段仅应用必要 DOM 修改。
- `memo`: React 通常在父组件 re-render 时递归 re-render 子组件；memo 是性能优化工具，不是 correctness 保证。
- `React Compiler`: 当前 Compiler 已稳定，可在构建期自动完成大量 memoization；本仓库当前 `package.json` 未配置 Compiler，因此后续 07-07 必须明确作为概念/对照实验，不伪装成已启用 Compiler 的运行结果。

## Validation

Chapter 07 尚未完成，因此章节质量门禁暂不标记为 PASS。

- `npm run lint`: PENDING — chapter gate
- `npm run build`: PENDING — chapter gate
- `npm run preview`: PENDING — chapter gate
- Browser smoke test: PENDING — chapter gate

在 07-03 ~ 07-07 完成后，必须执行完整 gate；若任一项失败，Chapter 07 保持进行中并先修复，不进入 Chapter 08。

## Next

继续 07-03 `React.memo`：做一个可观察的 memo hit / miss 实验，分别使用稳定 primitive prop 与每次 render 新建的 object/function prop，避免把 `memo` 描述成默认必需优化。
