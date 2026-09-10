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
- [x] 07-03 React.memo
  - 新增 `src/demos/ReactMemoDemo.jsx`
  - 对比稳定 primitive prop、每次 render 新建 object prop、`useMemo` 保持稳定 object prop 三种情况。
  - 通过子组件 `console.count` 观察 memo hit / miss；强调默认逐 prop 使用 `Object.is` 比较。
  - 明确 `memo` 只用于性能优化，不能阻止组件自己的 State 更新或其消费的 Context 更新。
  - 已注册到 `performance` 分类和 CodeViewer `?raw` 源码。
- [x] 07-04 useMemo
  - 新增 `src/demos/UseMemoDemo.jsx`
  - 使用 6000 条数据与可控 synthetic work 对比“直接重复计算”和“依赖未变时复用计算结果”。
  - 额外演示只有 identity 确实参与下游优化协议时才需要稳定对象，不把 `useMemo` 当 correctness 工具。
  - 明确开发 StrictMode 可能额外调用纯计算，不能用单次 console 次数替代真实性能分析。
  - 已注册到 `performance` 分类和 CodeViewer `?raw` 源码。
- [x] 07-05 useCallback
  - 新增 `src/demos/UseCallbackDemo.jsx`
  - 通过 `memo` 子组件对比普通函数 prop 与 `useCallback` 稳定函数引用，使用 `Object.is` 和 `console.count` 观察 identity 与 memo hit/miss。
  - 演示 functional updater 如何消除对当前 State 的读取，从而减少 callback dependency，而不是为了“骗过”依赖检查。
  - 明确 `useCallback` 缓存的是函数引用，不会让函数执行更快；只应在 memo child、Hook dependency、自定义 Hook API 等 identity 确有价值的边界使用。
  - 已注册到 `performance` 分类和 CodeViewer `?raw` 源码。
- [x] 07-06 Profiler
  - 新增 `src/demos/ProfilerDemo.jsx`。
  - 用 `<Profiler>` 的 `actualDuration`、`baseDuration`、`phase`、`commitTime` 可视化相关更新与无关父级 Render 的 commit 成本。
  - 对比普通昂贵列表与 `memo` 列表，强调先测量后优化；页面 synthetic workload 只用于教学，不替代 React DevTools Profiler 或接近生产环境的真实测量。
  - 已注册到 `performance` 分类和 CodeViewer `?raw` 源码。
- [x] 07-07 React Compiler
  - 新增 `src/demos/ReactCompilerDemo.jsx`。
  - 可视化没有 Compiler 时手工 `memo + useMemo` 用于稳定 identity 的维护成本，并建立“Compiler 在构建期自动承担大量 memoization”的心智模型。
  - 明确 Compiler 不改变 State/Render 数据流，依赖 Rules of React；介绍 `"use memo"` / `"use no memo"` 的渐进迁移与调试边界。
  - 当前仓库 `package.json` 未启用 React Compiler，因此 Demo 明确标注为概念/对照实验，不伪造 Compiler 运行结果。
  - 已注册到 `performance` 分类和 CodeViewer `?raw` 源码。

Chapter 07 内容项：**COMPLETE**。
章节完成状态：**BLOCKED_ON_EXECUTABLE_GATE**，未标记 Gate PASS，未进入 Chapter 08。

### Chapter 08 — 外部 Store 与第三方系统

- [ ] 未开始（必须先通过 Chapter 07 Gate）

### Chapter 09 — Server State 与请求架构

- [ ] 未开始

## Official-source review

当前实现依据 React 官方当前文档校准：

- `Render and Commit`: render 阶段调用组件计算 UI；re-render 时 React 在 commit 阶段仅应用必要 DOM 修改。
- `memo`: 父组件 re-render 时子组件默认可继续 render；`memo` 在 props 未变化时通常跳过子 render，默认逐 prop 使用 `Object.is`；它是性能优化而不是 correctness 保证。
- `useMemo`: 缓存纯计算结果直到依赖变化；依赖使用 `Object.is` 比较。只能依赖它进行性能优化，不能把业务正确性建立在缓存一定存在上。
- `useCallback`: 缓存函数定义直到依赖变化，依赖以 `Object.is` 比较；主要价值是保持函数 identity 以配合 memoized child 或其他 Hook dependency。它不会跳过函数创建，也不是 correctness 工具。
- `<Profiler>`: `onRender` 在被测树 commit 时收到 `actualDuration`、`baseDuration`、`phase`、`startTime`、`commitTime`；程序化 profiling 本身有开销，生产默认构建不启用 profiling，交互式分析应使用 React DevTools Profiler。
- `React Compiler`: 当前 Compiler 是构建期优化工具，可自动应用大量组件和值/函数 memoization；`"use memo"` / `"use no memo"` 是编译范围控制指令，应作为渐进迁移/调试手段而不是默认模板。

## Validation

Chapter 07 内容已完成，但强制章节质量门禁尚无法在当前执行环境真实完成，因此不得标记章节完成，也不得进入 Chapter 08。

- `npm ci`: BLOCKED — 当前自动执行环境无法解析 `github.com`，无法取得仓库可执行 checkout。
- `npm run lint`: PENDING — executable workspace unavailable
- `npm run build`: PENDING — executable workspace unavailable
- `npm run preview`: PENDING — executable workspace unavailable
- Browser smoke test: PENDING — executable workspace unavailable

2026-09-11 本轮再次尝试：

```text
git clone --branch learn/ch07-09-performance-data --single-branch https://github.com/CoderLambert/react-learning-playground.git
fatal: unable to access ... Could not resolve host: github.com
```

在可执行工作区恢复后，必须按顺序完成 `npm ci`（需要时）→ `npm run lint` → `npm run build` → `npm run preview`，并检查聚焦/连续阅读、搜索、CodeViewer、Console、窄屏 smoke。任一失败则先修复 Chapter 07，不进入 Chapter 08。

## Next

解除 executable workspace 阻塞后执行 Chapter 07 Gate。全部 PASS 后提交 chapter commit，再进入 Chapter 08 的 `useSyncExternalStore`。
